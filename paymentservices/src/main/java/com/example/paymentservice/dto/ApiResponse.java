package com.example.paymentservice.dto;
 
 
 
public class ApiResponse<T> {
    private String status;   // SUCCESS, FAILED
    private String message;  // human-readable message
    private T data;          // optional payload
 
    public ApiResponse() {}
 
    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
 
    // Getters and Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
 
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
 
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}
 
 