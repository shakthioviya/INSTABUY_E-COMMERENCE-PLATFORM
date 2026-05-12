package com.example.paymentservice.service;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
 
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;
 
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import com.example.paymentservice.entity.EmiPlan;
import com.example.paymentservice.entity.EmiSchedule;
import com.example.paymentservice.repository.EmiPlanRepository;
import com.example.paymentservice.repository.EmiScheduleRepository;
 
@ExtendWith(MockitoExtension.class)
public class EmiServiceTest {
 
    @Mock
    private EmiScheduleRepository emiScheduleRepository;
 
    @Mock
    private EmiPlanRepository emiPlanRepository;
 
    @InjectMocks
    private EmiService emiService;
 
    @Test
    void testCreateEmiSchedule() {
 
        EmiPlan plan = new EmiPlan();
 
        plan.setEmiPlanId(1L);
 
        when(emiScheduleRepository.findByPaymentId(1L))
                .thenReturn(new ArrayList<>());
 
        when(emiPlanRepository.save(
                org.mockito.ArgumentMatchers.any(
                        EmiPlan.class)))
                .thenReturn(plan);
 
        when(emiScheduleRepository.saveAll(
                org.mockito.ArgumentMatchers.anyList()))
                .thenReturn(new ArrayList<>());
 
        List<EmiSchedule> result =
                emiService.createEmiSchedule(
                        1L,
                        1L,
                        10000,
                        6,
                        0.02,
                        false
                );
 
        assertNotNull(result);
    }
 
    @Test
    void testPayInstallment() {
 
        EmiSchedule emi =
                new EmiSchedule();
 
        emi.setEmiId(1L);
        emi.setStatus("PENDING");
 
        when(emiScheduleRepository.findById(1L))
                .thenReturn(Optional.of(emi));
 
        when(emiScheduleRepository.save(emi))
                .thenReturn(emi);
 
        EmiSchedule result =
                emiService.payInstallment(1L);
 
        assertEquals(
                "PAID",
                result.getStatus()
        );
    }
}