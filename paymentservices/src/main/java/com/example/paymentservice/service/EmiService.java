package com.example.paymentservice.service;
 
 
 
import org.springframework.stereotype.Service;
 
import com.example.paymentservice.entity.EmiPlan;
import com.example.paymentservice.entity.EmiSchedule;
import com.example.paymentservice.repository.EmiPlanRepository;
import com.example.paymentservice.repository.EmiScheduleRepository;
 
import java.math.BigDecimal;
 
import java.time.LocalDate;
 
import java.util.ArrayList;
 
import java.util.List;
 
@Service
 
public class EmiService {
 
    private final EmiScheduleRepository emiScheduleRepository;
 
    private final EmiPlanRepository emiPlanRepository;
 
    public EmiService(EmiScheduleRepository emiScheduleRepository,
 
                      EmiPlanRepository emiPlanRepository) {
 
        this.emiScheduleRepository = emiScheduleRepository;
 
        this.emiPlanRepository = emiPlanRepository;
 
    }
 
    // 🔥 CREATE EMI PLAN + SCHEDULE
 
    public List<EmiSchedule> createEmiSchedule(Long paymentId,
 
                                               Long userId,
 
                                               double principal,
 
                                               int months,
 
                                               double annualInterestRate,
 
                                               boolean noCostEmi) {
 
        // ================= VALIDATION =================
 
        if (principal < 5000) {
 
            throw new IllegalArgumentException("EMI allowed only for amount above ₹5000");
 
        }
 
        if (!emiScheduleRepository.findByPaymentId(paymentId).isEmpty()) {
 
            throw new IllegalArgumentException("EMI already created for this payment");
 
        }
 
        // ================= TENURE =================
 
        List<Integer> allowedMonths;
 
        if (principal >= 5000 && principal <= 10000) {
 
            allowedMonths = List.of(3, 6);
 
        } else if (principal > 10000 && principal <= 50000) {
 
            allowedMonths = List.of(3, 6, 9, 12);
 
        } else {
 
            allowedMonths = List.of(3, 6, 9, 12, 18, 24);
 
        }
 
        if (!allowedMonths.contains(months)) {
 
            throw new IllegalArgumentException("Invalid EMI tenure. Allowed: " + allowedMonths);
 
        }
 
        // ================= EMI CALCULATION =================
 
        double monthlyInstallment;
 
        if (noCostEmi) {
 
            monthlyInstallment = principal / months;
 
        } else {
 
            double monthlyRate = annualInterestRate / 12;
 
            monthlyInstallment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
 
                    (Math.pow(1 + monthlyRate, months) - 1);
 
        }
 
        BigDecimal emiAmount = BigDecimal.valueOf(monthlyInstallment);
 
        // ================= 🔥 CREATE EMI PLAN =================
 
        EmiPlan plan = new EmiPlan();
 
        plan.setPaymentId(paymentId);
 
        plan.setUserId(userId);
 
        plan.setTotalAmount(BigDecimal.valueOf(principal));
 
        plan.setInterestRate(BigDecimal.valueOf(annualInterestRate));
 
        plan.setTenureMonths(months);
 
        plan.setMonthlyInstallment(emiAmount);
 
        plan.setStartDate(LocalDate.now());
 
        plan.setStatus("ACTIVE");
 
        EmiPlan savedPlan = emiPlanRepository.save(plan); // 🔥 DB INSERT
 
        // ================= 🔥 CREATE EMI SCHEDULE =================
 
        List<EmiSchedule> schedules = new ArrayList<>();
 
        for (int i = 1; i <= months; i++) {
 
            EmiSchedule emi = new EmiSchedule();
 
            emi.setEmiPlanId(savedPlan.getEmiPlanId()); // 🔗 LINK
 
            emi.setPaymentId(paymentId);
 
            emi.setInstallmentNumber(i);
 
            emi.setAmount(emiAmount);
 
            emi.setDueDate(LocalDate.now().plusMonths(i));
 
            emi.setStatus("PENDING");
 
            schedules.add(emi);
 
        }
 
        return emiScheduleRepository.saveAll(schedules); // 🔥 DB INSERT
 
    }
 
    // 🔥 FETCH EMI SCHEDULE
 
    public List<EmiSchedule> getScheduleByPayment(Long paymentId) {
 
        return emiScheduleRepository.findByPaymentId(paymentId);
 
    }
 
    // 🔥 PAY EMI INSTALLMENT
 
    public EmiSchedule payInstallment(Long emiId) {
 
        EmiSchedule emi = emiScheduleRepository.findById(emiId)
 
                .orElseThrow(() -> new RuntimeException("EMI not found"));
 
        emi.setStatus("PAID");
 
        emi.setPaidDate(LocalDate.now());
 
        return emiScheduleRepository.save(emi); // 🔥 UPDATE
 
    }
 
}
 