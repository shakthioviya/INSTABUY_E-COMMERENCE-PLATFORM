package com.example.paymentservice.dto;
 
import java.math.BigDecimal;
 
public class PaymentRequest {
 
    private Long userId;
    private Long orderId;
    private Long productId;
    private int quantity;
    private BigDecimal amount;
    private String paymentType;
 
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
 
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
 
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
 
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
 
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
 
    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
}