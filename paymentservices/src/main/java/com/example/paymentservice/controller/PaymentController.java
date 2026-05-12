package com.example.paymentservice.controller;
import java.util.List;

import com.example.paymentservice.dto.OrderItemDto;
import com.example.paymentservice.client.InventoryClient;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.paymentservice.client.InventoryClient;
import com.example.paymentservice.client.OrderClient;
import com.example.paymentservice.dto.ApiResponse;
import com.example.paymentservice.entity.EmiSchedule;
import com.example.paymentservice.entity.PaymentHistory;
import com.example.paymentservice.entity.Refund;
import com.example.paymentservice.repository.PaymentHistoryRepository;
import com.example.paymentservice.service.EmiService;
import com.example.paymentservice.service.OtpService;
import com.example.paymentservice.service.PaymentService;
import com.example.paymentservice.service.RefundService;
import com.example.paymentservice.service.WalletService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private RefundService refundService;

    @Autowired
    private EmiService emiService;

    @Autowired
    private WalletService walletService;

    @Autowired
    private OrderClient orderClient;

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;
    @Autowired
    private InventoryClient inventoryClient;
    @Autowired
    private OrderClient OrderClient;

    // ===================== HELPERS =====================
    private Long getUserId(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    /**
     * ✅ Forwards the JWT token from the original request to the order service.
     *    Without this, JwtFilter in order-service rejects the Feign call with 401
     *    and the order status silently stays PENDING.
     *
     *    Order status mapping:
     *      UPI / CARD / WALLET  → CONFIRMED
     *      EMI                  → EMI
     *      COD                  → PENDING
     */
    private void updateOrderStatus(Long orderId, String status, String authHeader) {
        try {
            String resp = orderClient.updateStatus(orderId, status, authHeader);
            System.out.println("✅ Order " + orderId + " → " + status + " | resp=" + resp);
        } catch (Exception e) {
            System.err.println("⚠️ Order update FAILED orderId=" + orderId + ": " + e.getMessage());
        }
    }

    // ===================== COD =====================
    @PostMapping("/payNow")
    public ResponseEntity<?> payNow(
            HttpServletRequest request,
            @RequestParam Long orderId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String couponCode,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Integer quantity,
            @RequestParam(required = false) String paymentType) {

        Long resolvedUserId = userId != null ? userId : getUserId(request);
        if (resolvedUserId == null) resolvedUserId = 1L;

        String resolvedPaymentType = (paymentType != null && !paymentType.isEmpty())
                ? paymentType : "COD";

        ApiResponse<PaymentHistory> result =
                paymentService.processPayment(
                        resolvedUserId, orderId, amount,
                        resolvedPaymentType, couponCode, null);

        // If called by Feign — return plain String
        if (userId != null) {
            if ("SUCCESS".equalsIgnoreCase(result.getStatus())) {
                return ResponseEntity.ok("PAYMENT_SUCCESS");
            } else {
                return ResponseEntity.status(400).body("FAILED: " + result.getMessage());
            }
        }

        // COD → stays PENDING in orders table (payment at delivery)
        if ("SUCCESS".equalsIgnoreCase(result.getStatus())) {
            String orderStatus = resolvedPaymentType.equalsIgnoreCase("COD")
                    ? "PENDING" : "CONFIRMED";
            updateOrderStatus(orderId, orderStatus, request.getHeader("Authorization"));
        }

        return ResponseEntity.ok(result);
    }

    // ===================== WALLET =====================
    @PostMapping("/wallet/pay")
    public ResponseEntity<ApiResponse<PaymentHistory>> payWithWallet(
            HttpServletRequest request,
            @RequestParam Long orderId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String couponCode) {

        Long userId = getUserId(request);
        if (userId == null) userId = 1L;

        ApiResponse<PaymentHistory> result =
                paymentService.processPayment(userId, orderId, amount, "WALLET", couponCode, null);

        // WALLET → CONFIRMED
        if ("SUCCESS".equalsIgnoreCase(result.getStatus())) {
            updateOrderStatus(orderId, "SUCCESS", request.getHeader("Authorization"));
        }

        return ResponseEntity.ok(result);
    }

    // ===================== WALLET TOPUP INITIATE =====================
    @PostMapping("/wallet/topup/initiate")
    public ResponseEntity<String> initiateWalletTopup(
            HttpServletRequest request,
            @RequestParam String email,
            @RequestParam String upiId,
            @RequestParam BigDecimal amount) {

        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) userId = 1L;

        String response = otpService.generateOtp(
                email, null, userId, amount.doubleValue(), "WALLET_TOPUP");
        return ResponseEntity.ok(response);
    }

    // ===================== WALLET TOPUP VERIFY =====================
    @PostMapping("/wallet/topup/verify")
    public ResponseEntity<ApiResponse<String>> verifyWalletTopup(
            HttpServletRequest request,
            @RequestParam String email,
            @RequestParam String enteredOtp) {

        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) userId = 1L;

        OtpService.OtpEntry otpData =
                otpService.verifyOtp(email, null, enteredOtp.trim());

        if (otpData != null) {
            try {
                String result = walletService.addMoney(
                        otpData.getUserId(),
                        BigDecimal.valueOf(otpData.getAmount()));
                return ResponseEntity.ok(new ApiResponse<>("SUCCESS", result, null));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>("FAILED", e.getMessage(), null));
            }
        }

        return ResponseEntity.badRequest()
                .body(new ApiResponse<>("FAILED", "Invalid or Expired OTP!", null));
    }

    // ===================== UPI =====================
    @PostMapping("/upi/initiate")
    public ResponseEntity<String> initiateUpi(
            HttpServletRequest request,
            @RequestParam String upiId,
            @RequestParam String email,
            @RequestParam Long orderId,
            @RequestParam BigDecimal amount) {
        try {
            Long userId = getUserId(request);
            if (userId == null) userId = 1L;

            String response = otpService.generateOtp(
                    email, orderId, userId, amount.doubleValue(), "UPI");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ✅ HttpServletRequest added to forward JWT
    @PostMapping("/upi/verify")
    public ResponseEntity<ApiResponse<PaymentHistory>> verifyUpi(
            HttpServletRequest request,
            @RequestParam String email,
            @RequestParam Long orderId,
            @RequestParam String enteredOtp,
            @RequestParam(required = false) String couponCode) {

        OtpService.OtpEntry otpData =
                otpService.verifyOtp(email, orderId, enteredOtp.trim());

        if (otpData != null) {
            ApiResponse<PaymentHistory> result =
                    paymentService.processPayment(
                            otpData.getUserId(), orderId,
                            BigDecimal.valueOf(otpData.getAmount()),
                            "UPI", couponCode, null);

            // UPI → CONFIRMED
            if ("SUCCESS".equalsIgnoreCase(result.getStatus())) {
                updateOrderStatus(orderId, "SUCCESS", request.getHeader("Authorization"));
            }

            return ResponseEntity.ok(result);
        }

        return ResponseEntity.badRequest()
                .body(new ApiResponse<>("FAILED", "Invalid or Expired OTP!", null));
    }

    // ===================== CARD =====================
    @PostMapping("/card/initiate")
    public ResponseEntity<String> initiateCard(
            HttpServletRequest request,
            @RequestParam String cardHolderName,
            @RequestParam String cardNumber,
            @RequestParam String expiryDate,
            @RequestParam String cvv,
            @RequestParam String email,
            @RequestParam Long orderId,
            @RequestParam BigDecimal amount) {

        Long userId = getUserId(request);
        if (userId == null) userId = 1L;

        if (!cardNumber.matches("\\d{16}")) {
            return ResponseEntity.badRequest().body("Invalid Card Number");
        }
        if (!cvv.matches("\\d{3}")) {
            return ResponseEntity.badRequest().body("Invalid CVV");
        }

        String response = otpService.generateOtp(
                email, orderId, userId, amount.doubleValue(), "CARD");
        return ResponseEntity.ok(response);
    }

    // ✅ HttpServletRequest added to forward JWT
    @PostMapping("/card/verify")
    public ResponseEntity<ApiResponse<PaymentHistory>> verifyCard(
            HttpServletRequest request,
            @RequestParam String email,
            @RequestParam Long orderId,
            @RequestParam String enteredOtp,
            @RequestParam(required = false) String couponCode) {

        OtpService.OtpEntry otpData =
                otpService.verifyOtp(email, orderId, enteredOtp.trim());

        if (otpData != null) {
            ApiResponse<PaymentHistory> result =
                    paymentService.processPayment(
                            otpData.getUserId(), orderId,
                            BigDecimal.valueOf(otpData.getAmount()),
                            "CARD", couponCode, null);

            // CARD → CONFIRMED
            if ("SUCCESS".equalsIgnoreCase(result.getStatus())) {
                updateOrderStatus(orderId, "SUCCESS", request.getHeader("Authorization"));
            }

            return ResponseEntity.ok(result);
        }

        return ResponseEntity.badRequest()
                .body(new ApiResponse<>("FAILED", "Invalid or Expired OTP!", null));
    }

    // ===================== EMI =====================
    @PostMapping("/emi/initiate")
    public ResponseEntity<ApiResponse<List<EmiSchedule>>> initiateEmi(
            HttpServletRequest request,
            @RequestParam Long orderId,
            @RequestParam BigDecimal amount,
            @RequestParam int months) {

        Long userId = getUserId(request);
        if (userId == null) userId = 1L;

        ApiResponse<PaymentHistory> payment =
                paymentService.processPayment(
                        userId, orderId, amount, "EMI", null, months);

        if (!"SUCCESS".equalsIgnoreCase(payment.getStatus())) {
            return ResponseEntity.ok(
                    new ApiResponse<>("FAILED", payment.getMessage(), null));
        }

        // EMI → show "EMI" in orders table
        updateOrderStatus(orderId, "EMI", request.getHeader("Authorization"));

        List<EmiSchedule> schedules = emiService.createEmiSchedule(
                payment.getData().getPaymentId(),
                userId,
                amount.doubleValue(),
                months,
                0.12,
                false);

        return ResponseEntity.ok(
                new ApiResponse<>("SUCCESS", "EMI initiated successfully", schedules));
    }

    // ===================== REFUND =====================
    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<?> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentHistory payment = paymentHistoryRepository.findByOrderId(orderId).orElse(null);
        if (payment == null) {
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>("FAILED", "No payment found", null));
        }
        return ResponseEntity.ok(new ApiResponse<>("SUCCESS", "Payment fetched!", payment)); // ✅
    }
    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<Refund>> cancelOrder(
            HttpServletRequest request,
            @RequestParam Long paymentId,
            @RequestParam boolean toWallet) {

        try {

            // ✅ REFUND
            Refund refundData =
                    refundService.initiateRefund(
                            paymentId,
                            LocalDate.now(),
                            toWallet
                    );

            // ✅ GET PAYMENT DETAILS
            PaymentHistory payment =
                    paymentHistoryRepository.findById(paymentId)
                    .orElseThrow(() ->
                            new RuntimeException("Payment not found"));

            Long orderId = payment.getOrderId();

            // ✅ GET ORDER ITEMS
            List<OrderItemDto> items =
                    orderClient.getOrderItems(
                            orderId,
                            request.getHeader("Authorization")
                    );

            // ✅ RESTORE STOCK
            for (OrderItemDto item : items) {

                inventoryClient.releaseStock(
                        item.getProductId(),
                        item.getQuantity()
                );
            }

            // ✅ UPDATE ORDER STATUS
            updateOrderStatus(
                    orderId,
                    "CANCELLED",
                    request.getHeader("Authorization")
            );

            // ✅ COD CASE
            if ("NOT_APPLICABLE".equalsIgnoreCase(refundData.getStatus())) {

                return ResponseEntity.ok(
                        new ApiResponse<>(
                                "SUCCESS",
                                "COD order cancelled. No refund applicable as payment was not collected.",
                                refundData
                        )
                );
            }

            // ✅ NORMAL SUCCESS
            return ResponseEntity.ok(
                    new ApiResponse<>(
                            "SUCCESS",
                            "Refund processed!",
                            refundData
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(
                            "FAILED",
                            e.getMessage(),
                            null
                    ));

        } catch (IllegalStateException e) {

            return ResponseEntity.status(400)
                    .body(new ApiResponse<>(
                            "FAILED",
                            e.getMessage(),
                            null
                    ));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(
                            "ERROR",
                            "Refund failed: " + e.getMessage(),
                            null
                    ));
        }
    }
    

    // ===================== COUPON =====================
    @PostMapping("/coupons/validate")
    public ResponseEntity<ApiResponse<String>> validateCoupon(
            HttpServletRequest request,
            @RequestParam String couponCode) {

        Long userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse<>("FAILED", "User not logged in", null));
        }

        boolean isFirstTimeUser = !paymentHistoryRepository
                .existsByUserIdAndPaymentStatus(userId, "SUCCESS");

        if (!isFirstTimeUser) {
            return ResponseEntity.status(403)
                    .body(new ApiResponse<>("FAILED",
                            "Coupon only valid for first-time users", null));
        }

        if ("FIRST250".equalsIgnoreCase(couponCode)) {
            return ResponseEntity.ok(
                    new ApiResponse<>("SUCCESS", "Coupon applied! ₹250 discount", "250"));
        } else {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("FAILED", "Invalid coupon code", null));
        }
    }
}