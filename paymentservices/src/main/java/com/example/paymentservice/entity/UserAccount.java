package com.example.paymentservice.entity;
 
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity

@Table(name = "user_account")

public class UserAccount {

    @Id

    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long accountId;

    private Long userId;

    private String accountHolderName;

    private String bankName;

    private String accountNumber;

    private BigDecimal balance = BigDecimal.ZERO;

    private BigDecimal walletBalance = BigDecimal.ZERO;

    // ========== GETTERS & SETTERS ==========

    public Long getAccountId() { return accountId; }

    public void setAccountId(Long accountId) { this.accountId = accountId; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public String getAccountHolderName() { return accountHolderName; }

    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }

    public String getBankName() { return bankName; }

    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountNumber() { return accountNumber; }

    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public BigDecimal getBalance() { return balance; }

    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public BigDecimal getWalletBalance() { return walletBalance; }

    public void setWalletBalance(BigDecimal walletBalance) { this.walletBalance = walletBalance; }

}
 