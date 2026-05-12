package com.example.paymentservice.service;
 
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
 
import com.example.paymentservice.entity.UserAccount;

import com.example.paymentservice.repository.UserAccountRepository;
 
import java.math.BigDecimal;

@Service

public class WalletService {

    @Autowired

    private UserAccountRepository userRepo;

    // 💰 TOP-UP (Add money to wallet)

    public String addMoney(Long userId, BigDecimal amount) {
        UserAccount user = userRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Check sufficient balance
        if (user.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient account balance");
        }

        // ✅ Deduct from account balance (UPI side)
        user.setBalance(user.getBalance().subtract(amount));

        // ✅ Credit to wallet
        user.setWalletBalance(user.getWalletBalance().add(amount));

        userRepo.save(user);
        return "Wallet topped up successfully";
    }

    // 💸 DEBIT (When user pays using wallet)

    public void debitWallet(UserAccount user, BigDecimal amount) {

        if (user.getWalletBalance().compareTo(amount) < 0) {

            throw new RuntimeException("Insufficient wallet balance");

        }

        user.setWalletBalance(user.getWalletBalance().subtract(amount));

        userRepo.save(user);

    }

    // 💰 CREDIT (Refund to wallet)

    public void creditWallet(UserAccount user, BigDecimal amount) {

        user.setWalletBalance(user.getWalletBalance().add(amount));

        userRepo.save(user);

    }

}
 