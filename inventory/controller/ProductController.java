package com.example.inventory.controller;
 

import io.swagger.v3.oas.models.Paths;
import jakarta.persistence.criteria.Path;
 
import java.nio.file.Files;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.inventory.entity.Product;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.service.InventoryService;
import com.example.inventory.service.ProductService;

import java.io.File;
import java.nio.file.Files;
import java.util.List;
 
@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = {
		 "http://localhost:3000",
		 "http://localhost:3001"
		})
public class ProductController {
 
    @Autowired
    private ProductService service;
    @Autowired
    private ProductRepository productRepo;
    @Autowired
    private InventoryService inventoryService;
 
    // ✅ ADD PRODUCT
    @PostMapping("/add")
    public String addProduct(@RequestBody Product p) {
        return service.addProduct(p);
    }
    @PostMapping(value = "/addWithImage", consumes = "multipart/form-data")
    public String addProductWithImage(
            @RequestParam String productName,
            @RequestParam double price,
            @RequestParam String description,
            @RequestParam int quantity,
            @RequestParam Long dealerId,
            @RequestParam Double discount,
            @RequestParam MultipartFile file) {
 
        try {
 
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
 
            String uploadPath = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadPath);
            if (!dir.exists()) dir.mkdirs();
 
            file.transferTo(new File(uploadPath + fileName));
 
            Product p = new Product();
            p.setProductName(productName);
            p.setPrice(price);
            p.setDescription(description);
            p.setDealerId(dealerId);
            p.setImageUrl(fileName);
 
            p.setQuantity(quantity);   // ✅ normal quantity
            p.setDiscount(discount);   // ✅ only new field
 
            return service.addProduct(p);
 
        } catch (Exception e) {
            e.printStackTrace();
            return "Error";
        }
    }
    // ✅ GET DEALER PRODUCTS
    @GetMapping("/dealer/{dealerId}")
    public List<Product> getProducts(@PathVariable Long dealerId) {
        return service.getDealerProducts(dealerId);
    }
 
    // ✅ LOW STOCK ALERT
    @GetMapping("/lowstock/{dealerId}")
    public List<Product> lowStock(@PathVariable Long dealerId) {
        return service.getLowStockProducts(dealerId);
    }
 
    // ✅ DELETE PRODUCT
    @DeleteMapping("/delete/{productId}")
    public String delete(@PathVariable Long productId) {
        return service.deleteProduct(productId);
    }
    @PostMapping("/addStock")
    public String addStock(@RequestBody Product p) {
        return service.addStock(
            p.getProductName(),
            p.getDealerId(),
            p.getQuantity()
        );
    }
    @GetMapping("/search")
    public List<Product> search(
            @RequestParam String keyword,
            @RequestParam Long dealerId) {
 
        return service.searchProducts(keyword, dealerId);
    }
    @PostMapping("/reduce")
    public String reduceStock(@RequestBody Product p) {
        return service.reduceStock(
            p.getProductName(),
            p.getDealerId(),
            p.getQuantity()
        );
    }
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }
    @PutMapping("/update")
    public ResponseEntity<String> updateProduct(@RequestBody Product p) {
        try {
            Product existing = productRepo.findById(p.getProductId())
                .orElse(null);
 
            if (existing == null) {
                return ResponseEntity.status(404).body("Product not found");
            }
 
            existing.setProductName(p.getProductName());
            existing.setPrice(p.getPrice());
            existing.setDescription(p.getDescription());
 
            productRepo.save(existing);
            inventoryService.updateInventoryProduct(
            		existing.getProductId(),
            		existing.getProductName(),
            		existing.getPrice()
            		);
 
            return ResponseEntity.ok("Product + Inventory updated successfully");
 
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Update failed");
        }
    }
 
    

}