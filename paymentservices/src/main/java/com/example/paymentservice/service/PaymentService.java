package com.example.paymentservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.paymentservice.repository.PaymentHistoryRepository;
import com.example.paymentservice.repository.UserAccountRepository;
import com.example.paymentservice.dto.ApiResponse;
import com.example.paymentservice.entity.PaymentHistory;
import com.example.paymentservice.entity.UserAccount;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private UserAccountRepository userAccountRepo;

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepo;

    @Autowired
    private WalletService walletService;

    // ✅ OrderClient REMOVED from here — controller handles order status update
    //    Calling Feign inside @Transactional caused 500 on rollback

    @Transactional
    public ApiResponse<PaymentHistory> processPayment(
            Long userId,
            Long orderId,
            BigDecimal amount,
            String paymentType,
            String couponCode,
            Integer emiMonths) {

        System.out.println("🔥 PAYMENT SERVICE EXECUTED");

        Optional<UserAccount> userOpt = userAccountRepo.findByUserId(userId);
        if (userOpt.isEmpty()) {
            return new ApiResponse<>("FAILED", "User not found!", null);
        }

        UserAccount account = userOpt.get();
        paymentType = paymentType.trim().toUpperCase();

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            return new ApiResponse<>("FAILED", "Invalid amount!", null);
        }

        if (!List.of("COD", "UPI", "CARD", "EMI", "WALLET").contains(paymentType)) {
            return new ApiResponse<>("FAILED", "Unsupported payment type!", null);
        }

        // ✅ Block only SUCCESS duplicates — PENDING (COD) can be overridden
        if (paymentHistoryRepo.existsByOrderIdAndPaymentStatus(orderId, "SUCCESS")) {
            return new ApiResponse<>("FAILED", "Payment already processed!", null);
        }

        // ✅ If switching from COD (PENDING) to real payment, remove the old PENDING record
        if (!paymentType.equals("COD") &&
                paymentHistoryRepo.existsByOrderIdAndPaymentStatus(orderId, "PENDING")) {
            paymentHistoryRepo.deleteByOrderIdAndPaymentStatus(orderId, "PENDING");
        }

        // ===================== PRICING =====================
        BigDecimal productAmount = amount;
        BigDecimal platformFee   = BigDecimal.valueOf(10);
        BigDecimal shippingFee   = BigDecimal.ZERO;

        if (amount.compareTo(BigDecimal.valueOf(500)) < 0) {
            shippingFee = BigDecimal.valueOf(50);
        }

        BigDecimal finalAmount = productAmount
                .add(platformFee)
                .add(shippingFee);

        // ===================== COUPON =====================
        boolean couponApplied = false;

        if (couponCode != null && couponCode.equalsIgnoreCase("FIRST250")) {
            if (!paymentType.equals("EMI")) {
                boolean hasPreviousPayments =
                        paymentHistoryRepo.existsByUserIdAndPaymentStatus(userId, "SUCCESS");
                if (!hasPreviousPayments && finalAmount.compareTo(BigDecimal.valueOf(1000)) >= 0) {
                    finalAmount = finalAmount.subtract(BigDecimal.valueOf(250));
                    couponApplied = true;
                    System.out.println("✅ Coupon applied");
                } else {
                    System.out.println("❌ Coupon not applicable");
                }
            }
        }

        System.out.println("Final Amount: " + finalAmount);

        // ===================== PAYMENT =====================
        PaymentHistory history = new PaymentHistory();
        history.setUserId(userId);
        history.setOrderId(orderId);
        history.setTransactionId(UUID.randomUUID().toString());
        history.setTransactionDate(LocalDate.now());

        // COD — no deduction, payment at delivery
        if (paymentType.equals("COD")) {
            history.setPaymentMethod("COD");
            history.setPaymentStatus("PENDING");
            System.out.println("📦 COD registered — payment at delivery");
        }

        // EMI
        else if (paymentType.equals("EMI")) {
            history.setPaymentMethod("CARD");
            history.setPaymentStatus("EMI_ACTIVE");
            // ✅ No orderClient call here — controller updates order after this returns
        }

        // WALLET
        else if (paymentType.equals("WALLET")) {
            try {
                walletService.debitWallet(account, finalAmount);
            } catch (Exception e) {
                return new ApiResponse<>("FAILED", e.getMessage(), null);
            }
            history.setPaymentMethod("WALLET");
            history.setPaymentStatus("SUCCESS");
            // ✅ No orderClient call here — controller updates order after this returns
        }

        // UPI / CARD
        else {
            history.setPaymentMethod(paymentType);
            if (account.getBalance().compareTo(finalAmount) < 0) {
                return new ApiResponse<>("FAILED", "Insufficient Balance!", null);
            }
            account.setBalance(account.getBalance().subtract(finalAmount));
            userAccountRepo.save(account);
            history.setPaymentStatus("SUCCESS");
            // ✅ No orderClient call here — controller updates order after this returns
        }

        // ===================== SAVE =====================
        history.setAmount(finalAmount);
        history.setProductAmount(productAmount);
        history.setPlatformFee(platformFee);
        history.setShippingFee(shippingFee);

        paymentHistoryRepo.save(history);

        String message = couponApplied
                ? "Payment successful (Coupon Applied)"
                : "Payment successful";

        return new ApiResponse<>("SUCCESS", message, history);
    }
}