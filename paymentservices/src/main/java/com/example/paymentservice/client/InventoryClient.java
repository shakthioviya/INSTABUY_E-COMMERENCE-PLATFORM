package com.example.paymentservice.client;
 
import org.springframework.cloud.openfeign.FeignClient;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestParam;
 
@FeignClient(name = "inventoryservices2")

public interface InventoryClient {
 
    @PostMapping("/api/inventory/confirm")

    String confirmOrder(@RequestParam("productId") Long productId,

                        @RequestParam("quantity") int quantity);
    @PostMapping("/api/inventory/release-internal")
    String releaseStock(
            @RequestParam("productId") Long productId,
            @RequestParam("quantity") int quantity
    );

}

 