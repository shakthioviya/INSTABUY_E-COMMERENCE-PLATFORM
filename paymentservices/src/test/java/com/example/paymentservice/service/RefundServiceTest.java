package com.example.paymentservice.service;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
 
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
 
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import com.example.paymentservice.entity.PaymentHistory;
import com.example.paymentservice.entity.Refund;
import com.example.paymentservice.entity.UserAccount;
import com.example.paymentservice.repository.PaymentHistoryRepository;
import com.example.paymentservice.repository.RefundRepository;
import com.example.paymentservice.repository.UserAccountRepository;
 
@ExtendWith(MockitoExtension.class)
public class RefundServiceTest {
 
    @Mock
    private PaymentHistoryRepository paymentHistoryRepository;
 
    @Mock
    private RefundRepository refundRepository;
 
    @Mock
    private UserAccountRepository userAccountRepository;
 
    @Mock
    private WalletService walletService;
 
    @InjectMocks
    private RefundService refundService;
 
    @Test
    void testRefundSuccess() {
 
        PaymentHistory payment =
                new PaymentHistory();
 
        payment.setPaymentId(1L);
        payment.setPaymentStatus("SUCCESS");
        payment.setTransactionDate(LocalDate.now());
        payment.setProductAmount(BigDecimal.valueOf(5000));
        payment.setUserId(1L);
 
        UserAccount account =
                new UserAccount();
 
        account.setUserId(1L);
        account.setBalance(BigDecimal.valueOf(1000));
 
        when(paymentHistoryRepository.findById(1L))
                .thenReturn(Optional.of(payment));
 
        when(userAccountRepository.findByUserId(1L))
                .thenReturn(Optional.of(account));
 
        Refund refund =
                refundService.initiateRefund(
                        1L,
                        LocalDate.now(),
                        false
                );
 
        assertEquals(
                "COMPLETED",
                refund.getStatus()
        );
    }
}