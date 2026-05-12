package com.example.paymentservice.entity;
 
import jakarta.persistence.*;
 
import java.math.BigDecimal;
 
import java.time.LocalDate;

@Entity
 
@Table(name = "refunds")
 
public class Refund {

    @Id
 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
 
    private Long refundId;

    @Column(nullable = false)
 
    private Long paymentId;

    @Column(nullable = false)
 
    private BigDecimal amount;

    @Column(nullable = false)
 
    private LocalDate refundDate;   // ✅ matches LocalDate in RefundService

    @Column(nullable = false)
 
    private String status;          // e.g. COMPLETED, INITIATED

    @Column(nullable = false)
 
    private String type;            // FULL or PARTIAL

    // --- Getters and Setters ---
 
    public Long getRefundId() {
 
        return refundId;
 
    }

    public void setRefundId(Long refundId) {
 
        this.refundId = refundId;
 
    }

    public Long getPaymentId() {
 
        return paymentId;
 
    }

    public void setPaymentId(Long paymentId) {
 
        this.paymentId = paymentId;
 
    }

    public BigDecimal getAmount() {
 
        return amount;
 
    }

    public void setAmount(BigDecimal amount) {
 
        this.amount = amount;
 
    }

    public LocalDate getRefundDate() {
 
        return refundDate;
 
    }

    public void setRefundDate(LocalDate refundDate) {
 
        this.refundDate = refundDate;
 
    }

    public String getStatus() {
 
        return status;
 
    }

    public void setStatus(String status) {
 
        this.status = status;
 
    }

    public String getType() {
 
        return type;
 
    }

    public void setType(String type) {
 
        this.type = type;
 
    }
 
}
 
 