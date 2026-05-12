package com.example.paymentservice.repository;
 
 
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
 
import com.example.paymentservice.entity.EmiPlan;
 
import java.util.List;

@Repository

public interface EmiPlanRepository extends JpaRepository<EmiPlan, Long> {

    // 🔍 Get all EMI plans for a user

    List<EmiPlan> findByUserId(Long userId);

    // 🔍 Get EMI plan by payment

    EmiPlan findByPaymentId(Long paymentId);

}
 