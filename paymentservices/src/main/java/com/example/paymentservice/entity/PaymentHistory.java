package com.example.paymentservice.entity;
 
import jakarta.persistence.*;
 
import java.math.BigDecimal;
 
import java.time.LocalDate;
 
@Entity
 
@Table(name = "payment_history")
 
public class PaymentHistory {
 
    @Id
 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
 
    @Column(name = "payment_id")
 
    private Long paymentId;
 
    @Column(name = "user_id")
 
    private Long userId;
 
    @Column(name = "order_id")
 
    private Long orderId;
 
    @Column(name = "transaction_id", unique = true)
 
    private String transactionId;
 
    @Column(name = "payment_method")
 
    private String paymentMethod;
 
    @Column(name = "payment_status")
 
    private String paymentStatus;
 
    @Column(name = "amount")
 
    private BigDecimal amount;
 
    // ✅ NEW: product amount (for refund logic)
 
    @Column(name = "product_amount")
 
    private BigDecimal productAmount;
 
    // ✅ NEW: platform fee
 
    @Column(name = "platform_fee")
 
    private BigDecimal platformFee;
 
    // ✅ NEW: shipping fee
 
    @Column(name = "shipping_fee")
 
    private BigDecimal shippingFee;
 
    // ✅ transaction date
 
    @Column(name = "transaction_date")
 
    private LocalDate transactionDate;
 
    // ================= GETTERS & SETTERS =================
 
    public Long getPaymentId() { return paymentId; }
 
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
 
    public Long getUserId() { return userId; }
 
    public void setUserId(Long userId) { this.userId = userId; }
 
    public Long getOrderId() { return orderId; }
 
    public void setOrderId(Long orderId) { this.orderId = orderId; }
 
    public String getTransactionId() { return transactionId; }
 
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
 
    public String getPaymentMethod() { return paymentMethod; }
 
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
 
    public String getPaymentStatus() { return paymentStatus; }
 
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
 
    public BigDecimal getAmount() { return amount; }
 
    public void setAmount(BigDecimal amount) { this.amount = amount; }
 
    public BigDecimal getProductAmount() { return productAmount; }
 
    public void setProductAmount(BigDecimal productAmount) { this.productAmount = productAmount; }
 
    public BigDecimal getPlatformFee() { return platformFee; }
 
    public void setPlatformFee(BigDecimal platformFee) { this.platformFee = platformFee; }
 
    public BigDecimal getShippingFee() { return shippingFee; }
 
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }
 
    public LocalDate getTransactionDate() { return transactionDate; }
 
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }
 
}