package com.example.paymentservice.repository;
 
 
import org.springframework.data.jpa.repository.JpaRepository;
 
import com.example.paymentservice.entity.Refund;

public interface RefundRepository extends JpaRepository<Refund, Long> {

    Refund findByPaymentId(Long paymentId);

}
 