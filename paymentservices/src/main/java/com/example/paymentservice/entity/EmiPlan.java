package com.example.paymentservice.entity;
 
 
import jakarta.persistence.*;
 
import java.math.BigDecimal;
 
import java.time.LocalDate;
@Entity
 
@Table(name = "emi_plan")
 
public class EmiPlan {
    @Id
 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
 
    @Column(name = "emi_plan_id")
 
    private Long emiPlanId;
    @Column(name = "payment_id", nullable = false)
 
    private Long paymentId;
    @Column(name = "user_id", nullable = false)
 
    private Long userId;
    @Column(name = "total_amount", nullable = false)
 
    private BigDecimal totalAmount;
    @Column(name = "interest_rate")
 
    private BigDecimal interestRate;
    @Column(name = "tenure_months")
 
    private Integer tenureMonths;
    @Column(name = "monthly_installment")
 
    private BigDecimal monthlyInstallment;
    @Column(name = "start_date")
 
    private LocalDate startDate;
    @Column(name = "status")
 
    private String status; // ACTIVE, COMPLETED
    // ================= GETTERS & SETTERS =================
    public Long getEmiPlanId() { return emiPlanId; }
 
    public void setEmiPlanId(Long emiPlanId) { this.emiPlanId = emiPlanId; }
    public Long getPaymentId() { return paymentId; }
 
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
    public Long getUserId() { return userId; }
 
    public void setUserId(Long userId) { this.userId = userId; }
    public BigDecimal getTotalAmount() { return totalAmount; }
 
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getInterestRate() { return interestRate; }
 
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public Integer getTenureMonths() { return tenureMonths; }
 
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }
    public BigDecimal getMonthlyInstallment() { return monthlyInstallment; }
 
    public void setMonthlyInstallment(BigDecimal monthlyInstallment) { this.monthlyInstallment = monthlyInstallment; }
    public LocalDate getStartDate() { return startDate; }
 
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public String getStatus() { return status; }
 
    public void setStatus(String status) { this.status = status; }
 
}
