package com.example.orderservice.dto;

public class OrderResponse {

    private Long orderId;
    private String status;
    private String message;

    public OrderResponse(Long orderId, String status, String message) {
        this.orderId = orderId;
        this.status = status;
        this.message = message;
    }

    public Long getOrderId() { return orderId; }
    public String getStatus() { return status; }
    public String getMessage() { return message; }
}