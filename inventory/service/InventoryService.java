package com.example.inventory.service;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.inventory.entity.Inventory;
import com.example.inventory.entity.Product;
import com.example.inventory.repository.InventoryRepository;
import com.example.inventory.repository.ProductRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryService {
 
    @Autowired
    private InventoryRepository repo;
    @Autowired
    private ProductRepository productRepo;
 
    // ✅ 1. CHECK STOCK
    public String checkStock(Long productId, int qty) {
 
        Inventory inv = repo.findByProductId(productId);
 
        if (inv == null) {
            return "PRODUCT NOT FOUND";
        }
 
        if (inv.getAvailableQuantity() >= qty) {
            return "IN STOCK";
        } else {
            return "OUT OF STOCK";
        }
    }
 
    // ✅ 2. RESERVE STOCK (BEFORE PAYMENT)
    @Transactional
    public String reserveStock(Long productId, int qty) {
 
        Inventory inv = repo.findByProductId(productId);
 
        if (inv == null) {
            throw new RuntimeException("Product not found");
        }
 
        if (inv.getAvailableQuantity() < qty) {
            throw new RuntimeException("Out of stock");
        }
 
        inv.setAvailableQuantity(inv.getAvailableQuantity() - qty);
        inv.setReservedQuantity(inv.getReservedQuantity() + qty);
        inv.setReservedAt(LocalDateTime.now());
 
        try {
            repo.save(inv);  // 🔥 version check happens here
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("⚠️ Stock updated by another user. Try again.");
        }
 
        return "Stock Reserved";
    }
 
    // ✅ 3. PAYMENT SUCCESS → FINAL DEDUCTION
 // ✅ 3. PAYMENT SUCCESS → FINAL DEDUCTION
    @Transactional
    public String confirmOrder(Long productId, int qty) {

        Inventory inv = repo.findByProductId(productId);

        if (inv == null) {
            throw new RuntimeException("Inventory not found for product: " + productId);
        }

        // ✅ Clear reserved quantity to 0
        inv.setReservedQuantity(0);

        // ✅ Reduce total quantity
        inv.setTotalQuantity(Math.max(0, inv.getTotalQuantity() - qty));

        // ✅ Clear reserved timestamp
        inv.setReservedAt(null);

        repo.save(inv);

        // ✅ REDUCE PRODUCT TABLE
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        product.setQuantity(Math.max(0, product.getQuantity() - qty));
        productRepo.save(product);

        return "Order Confirmed & Stock Deducted";
    }
    // ✅ 4. PAYMENT FAILED → RESTORE STOCK
    @Transactional
    public String releaseStock(Long productId, int qty) {

        Inventory inv = repo.findByProductId(productId);

        if (inv == null) {
            throw new RuntimeException("Inventory not found");
        }

        // ✅ Restore inventory quantities
        inv.setReservedQuantity(
                Math.max(0, inv.getReservedQuantity() - qty)
        );

        inv.setAvailableQuantity(inv.getAvailableQuantity() + qty);

        // ✅ Restore total quantity also
        inv.setTotalQuantity(inv.getTotalQuantity() + qty);

        inv.setReservedAt(null);

        repo.save(inv);

        // ✅ ALSO RESTORE PRODUCT TABLE STOCK
        Product product = productRepo.findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        product.setQuantity(product.getQuantity() + qty);

        productRepo.save(product);

        return "Stock Released & Product Updated";
    }
    // ✅ 5. AUTO TIMEOUT (5 MINUTES)
    @Transactional
    public void releaseTimeoutStock() {
 
        List<Inventory> list = repo.findAll();
 
        for (Inventory inv : list) {
 
            // ✅ ONLY if still reserved AND time exceeded
            if (inv.getReservedQuantity() > 0 &&
                inv.getReservedAt() != null &&
                inv.getReservedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
 
                // 🔥 restore deducted stock
                inv.setAvailableQuantity(
                    inv.getAvailableQuantity() + inv.getReservedQuantity()
                );
 
                // 🔥 clear reserved quantity
                inv.setReservedQuantity(0);
 
                // 🔥 clear timestamp
                inv.setReservedAt(null);
 
                repo.save(inv);
            }
        }
    }
    @Transactional
    public String addProduct(Long productId, String productName, int qty, double price) {
    	System.out.println("Inventory called");
    	System.out.println(productId);
    	
 
        if (qty <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }
 
        Inventory inv = repo.findByProductId(productId);
 
        if (inv != null) {
        	System.out.println("Updating inventory");
 
            // Existing product → restock
            inv.setTotalQuantity(inv.getTotalQuantity() + qty);
            inv.setAvailableQuantity(inv.getAvailableQuantity() + qty);
            inv.setPrice(price);
 
        } else {
        	System.out.println("Creating inventory row");
 
            // New inventory entry for existing product
            inv = new Inventory();
 
            // SAME product id from Product service
            inv.setProductId(productId);
 
            inv.setProductName(productName);
            inv.setPrice(price);
 
            inv.setTotalQuantity(qty);
            inv.setAvailableQuantity(qty);
            inv.setReservedQuantity(0);
 
        }
 
        try {
        	repo.saveAndFlush(inv);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new RuntimeException("Concurrent stock update detected. Retry.");
        }
 
        return "Product Added / Updated in Inventory";
    }
    public String deleteProductFromInventory(Long productId) {
 
        Inventory inv = repo.findByProductId(productId);
 
        if (inv != null) {
            repo.delete(inv);
            return "Deleted from inventory";
        }
 
        return "Product not found in inventory";
    }
  
    @Transactional
    public void reduceStock(Long productId, int qty) {

        System.out.println("INVENTORY REDUCE CALLED: " + productId);

        Inventory inv = repo.findByProductId(productId);

        if (inv == null) {
            System.out.println("❌ Inventory NOT FOUND for product: " + productId);
            return;
        }

        inv.setAvailableQuantity(inv.getAvailableQuantity() - qty);
        inv.setTotalQuantity(inv.getTotalQuantity() - qty);

        repo.saveAndFlush(inv);   // 🔥 VERY IMPORTANT FIX

        System.out.println("✅ Inventory UPDATED");
    }
    public Inventory getByProductId(Long productId) {
        return repo.findByProductId(productId);
    }
    @Transactional
    public void updateInventoryProduct(
            Long productId,
            String productName,
            double price
    ){
 
       Inventory inv =
          repo.findByProductId(productId);
 
       if(inv != null){
 
          inv.setProductName(productName); // update name
          inv.setPrice(price);             // update price
 
          repo.save(inv);
       }
    }
    public List<Inventory> getAllInventory() {
        return repo.findAll();
    }
    
 
    
}