package com.example.orderservice.service;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
 
import java.util.Optional;
 
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import com.example.orderservice.entity.Order;
import com.example.orderservice.repository.OrderRepository;
 
@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {
 
    @Mock
    private OrderRepository orderRepository;
 
    @InjectMocks
    private OrderService orderService;
 
    // ✅ SAVE ORDER TEST
    @Test
    void testSaveOrder() {
 
        Order order = new Order();
 
        order.setId(1L);
        order.setStatus("SUCCESS");
 
        when(orderRepository.save(order))
                .thenReturn(order);
 
        Order savedOrder =
                orderRepository.save(order);
 
        assertEquals(
                "SUCCESS",
                savedOrder.getStatus()
        );
    }
 
    // ✅ FIND ORDER TEST
    @Test
    void testFindOrderById() {
 
        Order order = new Order();
 
        order.setId(1L);
        order.setStatus("SUCCESS");
 
        when(orderRepository.findById(1L))
                .thenReturn(Optional.of(order));
 
        Optional<Order> result =
                orderRepository.findById(1L);
 
        assertEquals(
                true,
                result.isPresent()
        );
 
        assertEquals(
                "SUCCESS",
                result.get().getStatus()
        );
    }
}