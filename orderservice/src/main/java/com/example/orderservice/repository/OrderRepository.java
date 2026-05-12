package com.example.orderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.orderservice.entity.Order;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ NEW — fetch orders for a specific user, latest first
    List<Order> findByUserIdOrderByIdDesc(Long userId);
}