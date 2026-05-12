package com.example.paymentservice.controller;
 
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
 
import java.math.BigDecimal;
 
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
 
import com.example.paymentservice.dto.ApiResponse;
import com.example.paymentservice.entity.PaymentHistory;
import com.example.paymentservice.service.EmiService;
import com.example.paymentservice.service.OtpService;
import com.example.paymentservice.service.PaymentService;
import com.example.paymentservice.service.RefundService;
import com.example.paymentservice.service.WalletService;
 
@WebMvcTest(PaymentController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PaymentControllerTest {
 
    @Autowired
    private MockMvc mockMvc;
 
    // ✅ Mock Services
    @MockBean
    private PaymentService paymentService;
 
    @MockBean
    private OtpService otpService;
 
    @MockBean
    private RefundService refundService;
 
    @MockBean
    private EmiService emiService;
 
    @MockBean
    private WalletService walletService;
 
    // ✅ PAY NOW TEST
    @Test
    void testPayNow() throws Exception {
 
        PaymentHistory paymentHistory =
                new PaymentHistory();
 
        ApiResponse<PaymentHistory> response =
                new ApiResponse<>(
                        "SUCCESS",
                        "Payment Successful",
                        paymentHistory
                );
 
        when(paymentService.processPayment(
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(response);
 
        mockMvc.perform(
                post("/api/payments/payNow")
                        .param("orderId", "1")
                        .param("amount", "5000")
                        .param("userId", "1")
                        .param("paymentType", "COD")
        )
        .andExpect(status().isOk());
    }
 
    // ✅ WALLET PAYMENT TEST
    @Test
    void testWalletPayment() throws Exception {
 
        PaymentHistory paymentHistory =
                new PaymentHistory();
 
        ApiResponse<PaymentHistory> response =
                new ApiResponse<>(
                        "SUCCESS",
                        "Wallet Payment Successful",
                        paymentHistory
                );
 
        when(paymentService.processPayment(
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(response);
 
        mockMvc.perform(
                post("/api/payments/wallet/pay")
                        .requestAttr("userId", 1L)
                        .param("orderId", "1")
                        .param("amount", "2000")
        )
        .andExpect(status().isOk());
    }
 
    // ✅ UPI INITIATE TEST
    @Test
    void testInitiateUpi() throws Exception {
 
        when(otpService.generateOtp(
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyDouble(),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn("OTP SENT");
 
        mockMvc.perform(
                post("/api/payments/upi/initiate")
                        .requestAttr("userId", 1L)
                        .param("upiId", "test@upi")
                        .param("email", "user@gmail.com")
                        .param("orderId", "1")
                        .param("amount", "3000")
        )
        .andExpect(status().isOk());
    }
 
    // ✅ CARD INITIATE TEST
    @Test
    void testInitiateCard() throws Exception {
 
        when(otpService.generateOtp(
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.anyDouble(),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn("OTP SENT");
 
        mockMvc.perform(
                post("/api/payments/card/initiate")
                        .requestAttr("userId", 1L)
                        .param("cardHolderName", "Dhaarani")
                        .param("cardNumber", "1234567812345678")
                        .param("expiryDate", "12/30")
                        .param("cvv", "123")
                        .param("email", "user@gmail.com")
                        .param("orderId", "1")
                        .param("amount", "5000")
        )
        .andExpect(status().isOk());
    }
 
    // ✅ CANCEL ORDER TEST
    @Test
    void testCancelOrder() throws Exception {
 
        mockMvc.perform(
                post("/api/payments/cancel")
                        .param("paymentId", "1")
                        .param("toWallet", "true")
        )
        .andExpect(status().isOk());
    }
}