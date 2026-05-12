package com.example.paymentservice.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
 
import com.example.paymentservice.entity.PaymentHistory;
 
import java.util.Optional;
 
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long> {
 
    // Check duplicate payment for order
    boolean existsByOrderIdAndPaymentStatus(Long orderId, String paymentStatus);
 
    // For coupon logic
    boolean existsByUserIdAndPaymentStatus(Long userId, String paymentStatus);
    void deleteByOrderIdAndPaymentStatus(Long orderId, String paymentStatus);
 
    // For refund flow — look up payment by orderId
    Optional<PaymentHistory> findByOrderId(Long orderId);
    
}
 