package com.example.orderservice.controller;
 
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
 
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
 
import com.example.orderservice.dto.OrderResponse;
import com.example.orderservice.service.OrderService;
 
@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OrderControllerTest {
 
    @Autowired
    private MockMvc mockMvc;
 
    @MockBean
    private OrderService orderService;
 
    @Test
    void testPlaceOrder() throws Exception {
 
        // ✅ Mock Response
        OrderResponse response =
                new OrderResponse(
                        1L,
                        "SUCCESS",
                        "Order placed successfully"
                );
 
        // ✅ Mock Service
        when(orderService.placeOrder(
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(response);
 
        // ✅ Request Body
        String requestBody = """
        {
          "items":[
            {
              "productId":1,
              "productName":"Laptop",
              "quantity":2
            }
          ],
          "paymentType":"UPI"
        }
        """;
 
        // ✅ Correct API URL
        mockMvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk());
    }
}