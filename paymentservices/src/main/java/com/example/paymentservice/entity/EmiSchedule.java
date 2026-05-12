package com.example.paymentservice.entity;
 
 


import jakarta.persistence.*;
 
import java.math.BigDecimal;
 
import java.time.LocalDate;

@Entity
 
@Table(name = "emi_schedule")
 
public class EmiSchedule {

    @Id
 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
 
    @Column(name = "emi_id")
 
    private Long emiId;

    // 🔗 Link to EMI PLAN
 
    @Column(name = "emi_plan_id", nullable = false)
 
    private Long emiPlanId;

    // 🔗 Link to payment (optional but useful)
 
    @Column(name = "payment_id")
 
    private Long paymentId;

    @Column(name = "installment_number")
 
    private Integer installmentNumber;

    @Column(name = "amount")
 
    private BigDecimal amount;

    @Column(name = "due_date")
 
    private LocalDate dueDate;

    @Column(name = "paid_date")
 
    private LocalDate paidDate;

    @Column(name = "status")
 
    private String status; // PENDING, PAID, OVERDUE

    // ================= GETTERS & SETTERS =================

    public Long getEmiId() { return emiId; }
 
    public void setEmiId(Long emiId) { this.emiId = emiId; }

    public Long getEmiPlanId() { return emiPlanId; }
 
    public void setEmiPlanId(Long emiPlanId) { this.emiPlanId = emiPlanId; }

    public Long getPaymentId() { return paymentId; }
 
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public Integer getInstallmentNumber() { return installmentNumber; }
 
    public void setInstallmentNumber(Integer installmentNumber) { this.installmentNumber = installmentNumber; }

    public BigDecimal getAmount() { return amount; }
 
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getDueDate() { return dueDate; }
 
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDate getPaidDate() { return paidDate; }
 
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }

    public String getStatus() { return status; }
 
    public void setStatus(String status) { this.status = status; }
 
}

 