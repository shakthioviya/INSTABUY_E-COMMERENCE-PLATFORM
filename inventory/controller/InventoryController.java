package com.example.inventory.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import com.example.inventory.dto.InventoryRequest;
import com.example.inventory.entity.Inventory;
import com.example.inventory.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    // ─── FRONTEND ENDPOINTS (RequestBody) ────────────────────────────────────

    @PostMapping("/check")
    public String checkStockBody(@RequestBody InventoryRequest req) {
        return service.checkStock(req.getProductId(), req.getQuantity());
    }

    @PostMapping("/reserve")
    public String reserveBody(@RequestBody InventoryRequest req) {
        return service.reserveStock(req.getProductId(), req.getQuantity());
    }

    @PostMapping("/confirm")
    public String confirmBody(@RequestBody InventoryRequest req) {
        return service.confirmOrder(req.getProductId(), req.getQuantity());
    }

    @PostMapping("/release")
    public String releaseBody(@RequestBody InventoryRequest req) {
        return service.releaseStock(req.getProductId(), req.getQuantity());
    }

    @PostMapping("/addProduct")
    public String addProduct(@RequestBody InventoryRequest req) {
        return service.addProduct(
                req.getProductId(),
                req.getProductName(),
                req.getQuantity(),
                req.getPrice()
        );
    }

    // ─── INTERNAL MICROSERVICE ENDPOINTS (RequestParam) ──────────────────────

    @GetMapping("/check-internal")          
    public boolean checkStockInternal(@RequestParam Long productId,
                                      @RequestParam int quantity) {
        return service.checkStock(productId, quantity).equals("IN STOCK");
    }

    @PostMapping("/reserve-internal")       
    public String reserveInternal(@RequestParam Long productId,
                                  @RequestParam int quantity) {
        return service.reserveStock(productId, quantity);
    }

    @PostMapping("/confirm-internal")     
    public String confirmInternal(@RequestParam Long productId,
                                  @RequestParam int quantity) {
        return service.confirmOrder(productId, quantity);
    }

    @PostMapping("/release-internal")       
    public String releaseInternal(@RequestParam Long productId,
                                  @RequestParam int quantity) {
        return service.releaseStock(productId, quantity);
    }

    @GetMapping("/price/{productId}")      
    public double getPrice(@PathVariable Long productId) {
        Inventory inv = service.getByProductId(productId);
        return inv.getPrice();
    }
    @GetMapping("/all")
    public List<Inventory> getAllInventory() {
        return service.getAllInventory();
    }
}