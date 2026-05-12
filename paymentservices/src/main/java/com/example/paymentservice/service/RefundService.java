package com.example.paymentservice.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.paymentservice.entity.PaymentHistory;
import com.example.paymentservice.entity.Refund;
import com.example.paymentservice.entity.UserAccount;
import com.example.paymentservice.repository.PaymentHistoryRepository;
import com.example.paymentservice.repository.RefundRepository;
import com.example.paymentservice.repository.UserAccountRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class RefundService {

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;
    @Autowired
    private RefundRepository refundRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private WalletService walletService;

    @Transactional
    public Refund initiateRefund(Long paymentId, LocalDate cancelDate, boolean toWallet) {

        // ===================== FETCH PAYMENT (by paymentId OR orderId) =====================
        PaymentHistory payment = paymentHistoryRepository.findById(paymentId)
                .or(() -> paymentHistoryRepository.findByOrderId(paymentId))
                .orElseThrow(() -> new IllegalArgumentException("Invalid payment"));

        // ===================== BLOCK REFUND FOR COD =====================
        if ("COD".equalsIgnoreCase(payment.getPaymentMethod())) {  // ✅ getPaymentMethod()
            Refund refund = new Refund();
            refund.setPaymentId(payment.getPaymentId());           // ✅ getPaymentId()
            refund.setAmount(BigDecimal.ZERO);                     // ✅ BigDecimal
            refund.setRefundDate(cancelDate);
            refund.setStatus("NOT_APPLICABLE");
            refund.setType("COD_CANCELLATION");
            return refundRepository.save(refund);
        }

        // ===================== ONLY SUCCESS PAYMENTS CAN BE REFUNDED =====================
        if (!"SUCCESS".equalsIgnoreCase(payment.getPaymentStatus())) {
            throw new IllegalStateException("Only successful payments can be refunded");
        }

        // ===================== DATE CALC =====================
        LocalDate txnDate = payment.getTransactionDate();
        long daysBetween = ChronoUnit.DAYS.between(txnDate, cancelDate);

        // ===================== ONLY PRODUCT AMOUNT IS REFUNDED =====================
        BigDecimal baseAmount = payment.getProductAmount();
        BigDecimal refundAmount;
        String type;

        if (daysBetween <= 5) {
            refundAmount = baseAmount;
            type = "FULL";
        } else if (daysBetween <= 10) {
            refundAmount = baseAmount.multiply(BigDecimal.valueOf(0.5));
            type = "PARTIAL";
        } else {
            // ===================== NOT ELIGIBLE =====================
            Refund refund = new Refund();
            refund.setPaymentId(payment.getPaymentId());           // ✅ getPaymentId()
            refund.setAmount(BigDecimal.ZERO);                     // ✅ BigDecimal
            refund.setRefundDate(cancelDate);
            refund.setStatus("FAILED");
            refund.setType("NOT_ELIGIBLE");
            return refundRepository.save(refund);
        }

        // ===================== CREATE REFUND RECORD =====================
        Refund refund = new Refund();
        refund.setPaymentId(payment.getPaymentId());               // ✅ getPaymentId()
        refund.setAmount(refundAmount);                            // ✅ already BigDecimal
        refund.setRefundDate(cancelDate);
        refund.setStatus("COMPLETED");
        refund.setType(type);
        refundRepository.save(refund);

        // ===================== CREDIT USER ACCOUNT =====================
        UserAccount account = userAccountRepository.findByUserId(payment.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User account not found"));

        if (toWallet) {
            walletService.creditWallet(account, refundAmount);
        } else {
            account.setBalance(account.getBalance().add(refundAmount));
            userAccountRepository.save(account);
        }

        // ===================== UPDATE PAYMENT STATUS =====================
        payment.setPaymentStatus("REFUNDED");
        paymentHistoryRepository.save(payment);

        return refund;
    }
}