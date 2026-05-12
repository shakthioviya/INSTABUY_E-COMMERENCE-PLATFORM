package com.example.inventory.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.web.client.RestTemplate;

import com.example.inventory.entity.Inventory;
import com.example.inventory.entity.Product;
import com.example.inventory.repository.ProductRepository;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {
		 "http://localhost:3000",
		 "http://localhost:3001"
		})
public class DashboardController {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ProductRepository productRepo;

    @GetMapping("/{dealerId}")
    public Map<String, Object> getDashboard(@PathVariable Long dealerId) {

        // 1. Get dealer products
        List<Product> dealerProducts = productRepo.findByDealerId(dealerId);

        Set<Long> dealerProductIds = dealerProducts.stream()
                .map(Product::getProductId)
                .collect(Collectors.toSet());

        // 2. Get all orders
        List<Map<String, Object>> orders =
                restTemplate.getForObject(
                        "http://localhost:8085/api/orders",
                        List.class
                );

        // 3. Filter orders (ONLY dealer products)
        Map<Long, Integer> productSales = new HashMap<>();
        int totalSold = 0;
        double totalRevenue = 0;

        for (Map<String, Object> o : orders) {

            Long productId = ((Number) o.get("productId")).longValue();

            if (!dealerProductIds.contains(productId)) continue;

            int qty = ((Number) o.get("quantity")).intValue();

            totalSold += qty;

            // 🔥 FETCH PRODUCT PRICE
            Product product = productRepo.findById(productId).orElse(null);
            double price = (product != null) ? product.getPrice() : 0;

            totalRevenue += price * qty;

            productSales.put(
                    productId,
                    productSales.getOrDefault(productId, 0) + qty
            );
        }

        // 4. Get inventory
        List<Map<String, Object>> inventory =
        	    restTemplate.getForObject(
        	        "http://localhost:8087/api/inventory/all",
        	        List.class
        	    );

        List<Map<String, Object>> dealerInventory = inventory.stream()
                .filter(i -> dealerProductIds.contains(
                        ((Number) i.get("productId")).longValue()
                ))
                .toList();

        // 5. Top products
     // 5. Top products
        List<Map<String, Object>> topProducts =
                productSales.entrySet().stream()
                        .sorted((a, b) -> b.getValue() - a.getValue())
                        .limit(3)
                        .map(e -> {
                            Map<String, Object> m = new HashMap<>();

                            Long productId = e.getKey();

                            // 🔥 Fetch product name
                            Product product = productRepo.findById(productId).orElse(null);

                            m.put("productId", productId);
                            m.put("productName",
                                    product != null ? product.getProductName() : "Unknown");
                            m.put("sold", e.getValue());

                            return m;
                        }).toList();

        // 6. Slow products
        List<Map<String, Object>> slowProducts = new ArrayList<>();

        for (Map<String, Object> inv : dealerInventory) {

            Long productId = ((Number) inv.get("productId")).longValue();
            int stock = ((Number) inv.get("availableQuantity")).intValue();
            String name = (String) inv.get("productName");

            int sold = productSales.getOrDefault(productId, 0);

            if (sold < 5 && stock > 10) {
                Map<String, Object> m = new HashMap<>();
                m.put("productName", name);
                m.put("stock", stock);
                slowProducts.add(m);
            }
        }

        // 7. Turnover
        int totalStock = dealerInventory.stream()
                .mapToInt(i -> ((Number) i.get("availableQuantity")).intValue())
                .sum();

        double turnover = totalStock == 0 ? 0 :
                ((double) totalSold / totalStock) * 100;

        // 8. Response
        Map<String, Object> res = new HashMap<>();
        res.put("totalSold", totalSold);
        res.put("topProducts", topProducts);
        res.put("slowProducts", slowProducts);
        res.put("turnover", Math.round(turnover));
        res.put("totalRevenue", Math.round(totalRevenue));

        return res;
    }
}