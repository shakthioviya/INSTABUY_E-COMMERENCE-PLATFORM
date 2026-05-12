package com.example.login.controller;
 
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
 
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
 
import com.example.login.entity.User;
import com.example.login.security.JwtUtil;
import com.example.login.service.AuthService;
 
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // ✅ Disable Spring Security filters
public class AuthControllerTest {
 
    @Autowired
    private MockMvc mockMvc;
 
    // ✅ Mock Service
    @MockBean
    private AuthService service;
 
    // ✅ Mock JwtUtil
    @MockBean
    private JwtUtil jwtUtil;
 
    // ================= LOGIN TEST =================
    @Test
    void testLoginSuccess() throws Exception {
 
        User user = new User();
 
        user.setName("Dhaarani");
        user.setEmail("user@gmail.com");
        user.setPassword("1111");
        user.setRole("USER");
 
        // Mock login response
        when(service.login("user@gmail.com", "1111"))
                .thenReturn(user);
 
        // Mock JWT token
        when(jwtUtil.generateToken("user@gmail.com", null))
                .thenReturn("mock-token");
 
        String requestBody = """
        {
          "email":"user@gmail.com",
          "password":"1111"
        }
        """;
 
        mockMvc.perform(post("/api/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk());
    }
 
    // ================= REGISTER TEST =================
    @Test
    void testRegisterSuccess() throws Exception {
 
        when(service.signup(org.mockito.ArgumentMatchers.any(User.class)))
                .thenReturn("Signup successful!");
 
        String requestBody = """
        {
          "name":"Dhaarani",
          "email":"new@gmail.com",
          "password":"1234"
        }
        """;
 
        mockMvc.perform(post("/api/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk());
    }
 
    // ================= FORGOT PASSWORD TEST =================
    @Test
    void testForgotPassword() throws Exception {
 
        when(service.resetPassword("user@gmail.com", "new123"))
                .thenReturn("Password updated successfully!");
 
        String requestBody = """
        {
          "email":"user@gmail.com",
          "password":"new123"
        }
        """;
 
        mockMvc.perform(post("/api/auth/forgot-password")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk());
    }
}