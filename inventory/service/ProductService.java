package com.example.inventory.service;
 

 
import jakarta.transaction.Transactional;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.inventory.entity.Product;
import com.example.inventory.repository.ProductRepository;

import java.util.List;
 
@Service
public class ProductService {
 
    @Autowired
    private ProductRepository productRepo;
 
    @Autowired
    private InventoryService inventoryService;
 
  
 
    @Transactional
    public String addProduct(Product p) {
 
        Product existing =
            productRepo.findByProductNameAndDealerId(
                 p.getProductName(),
                 p.getDealerId()
            );
 
        if(existing != null){
 
            existing.setQuantity(
                 existing.getQuantity() + p.getQuantity()
            );
 
            productRepo.save(existing);
 
            inventoryService.addProduct(
                    existing.getProductId(),
                    existing.getProductName(),
                    p.getQuantity(),
                    existing.getPrice()
            );
 
            return "Quantity Updated";
        }
 
        // NEW PRODUCT
        Product saved = productRepo.save(p);
 
        // force inventory insert
        inventoryService.addProduct(
                saved.getProductId(),
                saved.getProductName(),
                saved.getQuantity(),
                saved.getPrice()
        );
 
        return "Added in product + inventory";
    }
    // ✅ GET PRODUCTS BY DEALER
    public List<Product> getDealerProducts(Long dealerId) {
        return productRepo.findByDealerId(dealerId);
    }
 
    // ✅ LOW STOCK ALERT (<6)
    public List<Product> getLowStockProducts(Long dealerId) {
        return productRepo.findByDealerId(dealerId)
                .stream()
                .filter(p -> p.getQuantity() < 6)
                .toList();
    }
 
    // ✅ DELETE PRODUCT
    public String deleteProduct(Long productId) {
 
        Product product = productRepo.findById(productId).orElse(null);
 
        if (product == null) {
            return "Product not found";
        }
 
      
 
        // 🔥 ALSO delete from inventory
        inventoryService.deleteProductFromInventory(productId);
        // 🔥 delete from product table
        productRepo.deleteById(productId);
 
        return "Product deleted from product and inventory";
    }
    
    public String addStock(String productName, Long dealerId, int qty) {
 
        Product product = productRepo
            .findByProductNameAndDealerId(productName, dealerId);
 
        if (product == null) {
            return "Product not found";
        }
 
        product.setQuantity(product.getQuantity() + qty);
        productRepo.save(product);
 
        inventoryService.addProduct(
            product.getProductId(),
            product.getProductName(),
            qty,
            product.getPrice()
        );
 
        return "Stock added successfully";
    }
    
    public String reduceStock(String productName, Long dealerId, int qty) {
 
        Product product = productRepo
            .findByProductNameAndDealerId(productName, dealerId);
 
        if (product == null) {
            return "Product not found";
        }
        
        if(qty <= 0) {
        	return "Invalid quantity";
        }
 
        // 🔥 Prevent negative stock
        if (product.getQuantity() < qty) {
            return "Not enough stock!";
        }
 
        product.setQuantity(product.getQuantity() - qty);
        productRepo.save(product);
 
        // 🔥 update inventory also
        inventoryService.reduceStock(
                product.getProductId(),
                qty
        );
 
        return "Stock reduced successfully";
    }
    public List<Product> searchProducts(String keyword, Long dealerId) {
 
        return productRepo
            .findByProductNameContainingIgnoreCaseAndDealerId(keyword, dealerId);
    }
    public Product updateProduct(Product updatedProduct) {
 
        Product existing = productRepo
                .findById(updatedProduct.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
 
        // ✅ Update only required fields
        existing.setProductName(updatedProduct.getProductName());
        existing.setPrice(updatedProduct.getPrice());
        existing.setDescription(updatedProduct.getDescription());
 
        return productRepo.save(existing);
    }
}