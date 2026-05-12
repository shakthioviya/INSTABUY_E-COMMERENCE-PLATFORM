package com.example.orderservice.dto;
 
public class OrderItemRequest {
 
    private Long productId;
    private String productName;
    private int quantity;
 
    public OrderItemRequest() {}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
 

 
  
}