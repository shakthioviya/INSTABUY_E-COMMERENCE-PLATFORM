package com.example.paymentservice.repository;
 
 
import org.springframework.data.jpa.repository.JpaRepository;
 
import com.example.paymentservice.entity.EmiSchedule;
 
import java.util.List;
 
public interface EmiScheduleRepository extends JpaRepository<EmiSchedule, Long> {
   // ✅ Custom finder to get all EMI installments for a given paymentId
   List<EmiSchedule> findByPaymentId(Long paymentId);
}