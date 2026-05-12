package com.example.paymentservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.example.paymentservice.dto.OrderItemDto;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ORDER-SERVICE")
public interface OrderClient {
	@GetMapping("/api/orders/{id}/items")
	List<OrderItemDto> getOrderItems(
	        @PathVariable("id") Long orderId,
	        @RequestHeader("Authorization") String authHeader
	);

    @PutMapping("/api/orders/status/{id}")
    String updateStatus(
        @PathVariable("id") Long orderId,
        @RequestParam("status") String status,
        @RequestHeader("Authorization") String authHeader  // ✅ forwards JWT to order service
    );
    
}