package com.example.paymentservice.service;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
 
import java.math.BigDecimal;
import java.util.Optional;
 
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import com.example.paymentservice.entity.UserAccount;
import com.example.paymentservice.repository.UserAccountRepository;
 
@ExtendWith(MockitoExtension.class)
public class WalletServiceTest {
 
    @Mock
    private UserAccountRepository userRepo;
 
    @InjectMocks
    private WalletService walletService;
 
    @Test
    void testAddMoney() {
 
        UserAccount user = new UserAccount();
 
        user.setUserId(1L);
        user.setWalletBalance(BigDecimal.valueOf(1000));
 
        when(userRepo.findByUserId(1L))
                .thenReturn(Optional.of(user));
 
        String result =
                walletService.addMoney(
                        1L,
                        BigDecimal.valueOf(500)
                );
 
        assertEquals(
                "Wallet topped up successfully",
                result
        );
    }
 
    @Test
    void testDebitWallet() {
 
        UserAccount user = new UserAccount();
 
        user.setWalletBalance(BigDecimal.valueOf(5000));
 
        walletService.debitWallet(
                user,
                BigDecimal.valueOf(1000)
        );
 
        assertEquals(
                BigDecimal.valueOf(4000),
                user.getWalletBalance()
        );
    }
 
    @Test
    void testInsufficientBalance() {
 
        UserAccount user = new UserAccount();
 
        user.setWalletBalance(BigDecimal.valueOf(100));
 
        assertThrows(
                RuntimeException.class,
                () -> walletService.debitWallet(
                        user,
                        BigDecimal.valueOf(500)
                )
        );
    }
}