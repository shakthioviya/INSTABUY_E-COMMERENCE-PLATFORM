package com.example.orderservice.dto;

import java.util.List;

public class OrderRequest {

    private Long userId;        // ✅ NEW
    private List<OrderItemRequest> items;
    private String paymentType;

    public OrderRequest() {}

    public Long getUserId() { return userId; }                    // ✅ NEW
    public void setUserId(Long userId) { this.userId = userId; }  // ✅ NEW

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
}