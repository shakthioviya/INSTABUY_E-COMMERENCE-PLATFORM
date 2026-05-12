package com.example.orderservice.service;

import com.example.orderservice.client.InventoryClient;
import com.example.orderservice.client.PaymentClient;
import com.example.orderservice.dto.OrderItemRequest;
import com.example.orderservice.dto.OrderRequest;
import com.example.orderservice.dto.OrderResponse;
import com.example.orderservice.entity.Order;
import com.example.orderservice.entity.OrderItem;
import com.example.orderservice.repository.OrderItemRepository;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final InventoryClient inventoryClient;

    @Autowired
    private PaymentClient paymentClient;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public OrderService(OrderRepository repository,
                        InventoryClient inventoryClient) {
        this.repository = repository;
        this.inventoryClient = inventoryClient;
    }

    // ✅ Reads userId from JWT attribute set by JwtFilter
    private Long getUserIdFromToken() {
        HttpServletRequest request =
            ((ServletRequestAttributes) RequestContextHolder
            .getRequestAttributes()).getRequest();
        Long userId = (Long) request.getAttribute("userId");
        if (userId == null) {
            throw new RuntimeException("Unauthorized: userId missing from token");
        }
        return userId;
    }

    public OrderResponse placeOrder(OrderRequest request) {

        // ✅ Always get userId from JWT, never from request body
        Long userId = getUserIdFromToken();

        // DEBUG
        System.out.println("=== placeOrder called ===");
        System.out.println("userId from JWT: " + userId);
        System.out.println("items: " + (request.getItems() == null ? "NULL" : request.getItems().size()));
        if (request.getItems() != null) {
            for (OrderItemRequest item : request.getItems()) {
                System.out.println("  -> productId=" + item.getProductId()
                    + " productName=" + item.getProductName()
                    + " qty=" + item.getQuantity());
            }
        }

        // GUARD: items must not be null or empty
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new RuntimeException("Order items are empty or null");
        }

        // STEP 1: CHECK STOCK FOR ALL ITEMS
        System.out.println("STEP 1: Checking stock...");
        for (OrderItemRequest item : request.getItems()) {
            try {
                boolean inStock = inventoryClient.checkStock(
                        item.getProductId(),
                        item.getQuantity()
                );
                if (!inStock) {
                    throw new RuntimeException("Out of stock: " + item.getProductName());
                }
            } catch (RuntimeException e) {
                throw e;
            } catch (Exception e) {
                System.out.println("checkStock failed for productId="
                    + item.getProductId() + ": " + e.getMessage());
                throw new RuntimeException("Inventory service error during stock check: "
                    + e.getMessage());
            }
        }

        // STEP 2: RESERVE STOCK FOR ALL ITEMS
        System.out.println("STEP 2: Reserving stock...");
        for (OrderItemRequest item : request.getItems()) {
            try {
                inventoryClient.reserveStock(
                        item.getProductId(),
                        item.getQuantity()
                );
            } catch (Exception e) {
                System.out.println("reserveStock failed for productId="
                    + item.getProductId() + ": " + e.getMessage());
                throw new RuntimeException("Inventory service error during stock reserve: "
                    + e.getMessage());
            }
        }

        // STEP 3: CALCULATE TOTAL
        System.out.println("STEP 3: Calculating total...");
        double grandTotal = 0.0;
        for (OrderItemRequest item : request.getItems()) {
            try {
                double price = inventoryClient.getPrice(item.getProductId());
                System.out.println("  price for " + item.getProductId() + " = " + price);
                grandTotal += price * item.getQuantity();
            } catch (Exception e) {
                System.out.println("getPrice failed for productId="
                    + item.getProductId() + ": " + e.getMessage());
                throw new RuntimeException("Inventory service error during price fetch: "
                    + e.getMessage());
            }
        }
        System.out.println("grandTotal = " + grandTotal);

        // STEP 4: SAVE ORDER with userId from JWT ✅
        System.out.println("STEP 4: Saving order...");
        Order order = new Order();
        order.setUserId(userId);                                      // ✅ JWT userId
        order.setProductId(request.getItems().get(0).getProductId());
        order.setProductName("Items");
        order.setQuantity(request.getItems().size());
        order.setTotalAmount(grandTotal);
        order.setStatus("PENDING");
        Order saved = repository.save(order);
        System.out.println("Order saved with id=" + saved.getId()
            + " userId=" + saved.getUserId());                        // ✅ confirm in logs

        // STEP 5: SAVE EACH ITEM
        System.out.println("STEP 5: Saving order items...");
        for (OrderItemRequest item : request.getItems()) {
            try {
                double price = inventoryClient.getPrice(item.getProductId());
                OrderItem orderItem = new OrderItem();
                orderItem.setOrderId(saved.getId());
                orderItem.setProductId(item.getProductId());
                orderItem.setProductName(item.getProductName());
                orderItem.setQuantity(item.getQuantity());
                orderItem.setPrice(price * item.getQuantity());
                orderItemRepository.save(orderItem);
            } catch (Exception e) {
                System.out.println("Saving orderItem failed for productId="
                    + item.getProductId() + ": " + e.getMessage());
                throw new RuntimeException("Failed to save order item: " + e.getMessage());
            }
        }

        // STEP 6: CONFIRM INVENTORY
        System.out.println("STEP 6: Confirming inventory...");
        for (OrderItemRequest item : request.getItems()) {
            try {
                inventoryClient.confirmOrder(
                        item.getProductId(),
                        item.getQuantity()
                );
            } catch (Exception e) {
                System.out.println("Confirm order failed: " + e.getMessage());
            }
        }

        // STEP 7: RETURN
        System.out.println("=== placeOrder SUCCESS, orderId="
            + saved.getId() + " userId=" + userId + " ===");
        return new OrderResponse(
                saved.getId(),
                "PENDING",
                "Order created successfully. Proceed to payment."
        );
    }

    // ✅ userId always from JWT, not from path variable
    public List<Order> getMyOrders() {
        Long userId = getUserIdFromToken();
        return repository.findByUserIdOrderByIdDesc(userId);
    }

    public OrderResponse cancelOrder(Long id) {
        Optional<Order> optional = repository.findById(id);
        if (!optional.isPresent()) {
            throw new RuntimeException("Order not found");
        }
        Order order = optional.get();
        order.setStatus("CANCELLED");
        repository.save(order);
        return new OrderResponse(order.getId(), "CANCELLED", "Order cancelled");
    }

    public List<Order> getAllOrders() {
        return repository.findAll();
    }

    public Order getOrder(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public String updateStatus(Long id, String status) {
        Order order = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        repository.save(order);
        return "Updated";
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
}