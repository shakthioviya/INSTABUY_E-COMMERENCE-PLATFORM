package com.example.orderservice.client;
 
import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.*;
 
import java.math.BigDecimal;
 
@FeignClient(name = "paymentservices", url = "http://localhost:8083")

public interface PaymentClient {
 
    @PostMapping("/api/payments/payNow")

    String payNow(

    		      @RequestHeader("Authorization") String token,

    			  @RequestParam("userId") Long userId,

                  @RequestParam("orderId") Long orderId,

                  @RequestParam("productId") Long productId,

                  @RequestParam("quantity") int quantity,

                  @RequestParam("amount") BigDecimal amount,

                  @RequestParam("paymentType") String paymentType);

}

 