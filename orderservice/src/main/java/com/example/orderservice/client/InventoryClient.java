package com.example.orderservice.client;
 
 
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
 
@FeignClient(name = "inventoryservices2")
public interface InventoryClient {
 
    @GetMapping("/api/inventory/check-internal")
    boolean checkStock(@RequestParam Long productId, @RequestParam int quantity);
 
    @PostMapping("/api/inventory/reserve-internal")
    String reserveStock(@RequestParam Long productId, @RequestParam int quantity);
 
    @PostMapping("/api/inventory/confirm-internal")   // ✅ ADD THIS
    String confirmOrder(@RequestParam Long productId, @RequestParam int quantity);
 
    @PostMapping("/api/inventory/release-internal")   // ✅ ADD THIS
    String releaseStock(@RequestParam Long productId, @RequestParam int quantity);
 
    @GetMapping("/api/inventory/price/{productId}")
    double getPrice(@PathVariable Long productId);
}