package com.example.paymentservice.service;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
 
import java.math.BigDecimal;
import java.util.Optional;
 
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import com.example.paymentservice.dto.ApiResponse;
import com.example.paymentservice.entity.PaymentHistory;
import com.example.paymentservice.entity.UserAccount;
import com.example.paymentservice.repository.PaymentHistoryRepository;
import com.example.paymentservice.repository.UserAccountRepository;
 
@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {
 
    @Mock
    private UserAccountRepository userAccountRepo;
 
    @Mock
    private PaymentHistoryRepository paymentHistoryRepo;
 
    @Mock
    private WalletService walletService;
 
    @InjectMocks
    private PaymentService paymentService;
 
    // ✅ COD PAYMENT TEST
    @Test
    void testCodPayment() {
 
        UserAccount account = new UserAccount();
 
        account.setUserId(1L);
        account.setBalance(BigDecimal.valueOf(10000));
 
        when(userAccountRepo.findByUserId(1L))
                .thenReturn(Optional.of(account));
 
        when(paymentHistoryRepo
                .existsByOrderIdAndPaymentStatus(
                        1L,
                        "SUCCESS"))
                .thenReturn(false);
 
        PaymentHistory history =
                new PaymentHistory();
 
        history.setPaymentStatus("SUCCESS");
 
        when(paymentHistoryRepo.save(
                org.mockito.ArgumentMatchers.any(
                        PaymentHistory.class)))
                .thenReturn(history);
 
        ApiResponse<PaymentHistory> response =
                paymentService.processPayment(
                        1L,
                        1L,
                        BigDecimal.valueOf(5000),
                        "COD",
                        null,
                        null
                );
 
        assertEquals(
                "SUCCESS",
                response.getStatus()
        );
    }
 
    // ✅ WALLET PAYMENT TEST
    @Test
    void testWalletPayment() {
 
        UserAccount account = new UserAccount();
 
        account.setUserId(1L);
        account.setBalance(BigDecimal.valueOf(10000));
 
        when(userAccountRepo.findByUserId(1L))
                .thenReturn(Optional.of(account));
 
        when(paymentHistoryRepo
                .existsByOrderIdAndPaymentStatus(
                        1L,
                        "SUCCESS"))
                .thenReturn(false);
 
        doNothing().when(walletService)
                .debitWallet(
                        org.mockito.ArgumentMatchers.any(),
                        org.mockito.ArgumentMatchers.any()
                );
 
        PaymentHistory history =
                new PaymentHistory();
 
        history.setPaymentStatus("SUCCESS");
 
        when(paymentHistoryRepo.save(
                org.mockito.ArgumentMatchers.any(
                        PaymentHistory.class)))
                .thenReturn(history);
 
        ApiResponse<PaymentHistory> response =
                paymentService.processPayment(
                        1L,
                        1L,
                        BigDecimal.valueOf(2000),
                        "WALLET",
                        null,
                        null
                );
 
        assertEquals(
                "SUCCESS",
                response.getStatus()
        );
    }
 
    // ✅ INVALID PAYMENT TYPE TEST
    @Test
    void testInvalidPaymentType() {
 
        UserAccount account = new UserAccount();
 
        account.setUserId(1L);
        account.setBalance(BigDecimal.valueOf(10000));
 
        when(userAccountRepo.findByUserId(1L))
                .thenReturn(Optional.of(account));
 
        ApiResponse<PaymentHistory> response =
                paymentService.processPayment(
                        1L,
                        1L,
                        BigDecimal.valueOf(1000),
                        "BITCOIN",
                        null,
                        null
                );
 
        assertEquals(
                "FAILED",
                response.getStatus()
        );
    }
 
    // ✅ USER NOT FOUND TEST
    @Test
    void testUserNotFound() {
 
        when(userAccountRepo.findByUserId(1L))
                .thenReturn(Optional.empty());
 
        ApiResponse<PaymentHistory> response =
                paymentService.processPayment(
                        1L,
                        1L,
                        BigDecimal.valueOf(1000),
                        "COD",
                        null,
                        null
                );
 
        assertEquals(
                "FAILED",
                response.getStatus()
        );
    }
 
    // ✅ COUPON PAYMENT TEST
    @Test
    void testCouponPayment() {
 
        UserAccount account = new UserAccount();
 
        account.setUserId(1L);
        account.setBalance(BigDecimal.valueOf(10000));
 
        when(userAccountRepo.findByUserId(1L))
                .thenReturn(Optional.of(account));
 
        when(paymentHistoryRepo
                .existsByOrderIdAndPaymentStatus(
                        1L,
                        "SUCCESS"))
                .thenReturn(false);
 
        when(paymentHistoryRepo
                .existsByUserIdAndPaymentStatus(
                        1L,
                        "SUCCESS"))
                .thenReturn(false);
 
        PaymentHistory history =
                new PaymentHistory();
 
        history.setPaymentStatus("SUCCESS");
 
        when(paymentHistoryRepo.save(
                org.mockito.ArgumentMatchers.any(
                        PaymentHistory.class)))
                .thenReturn(history);
 
        ApiResponse<PaymentHistory> response =
                paymentService.processPayment(
                        1L,
                        1L,
                        BigDecimal.valueOf(2000),
                        "COD",
                        "FIRST250",
                        null
                );
 
        assertEquals(
                "SUCCESS",
                response.getStatus()
        );
    }
}