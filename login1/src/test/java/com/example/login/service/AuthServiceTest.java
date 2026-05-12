package com.example.login.service;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;
 
import java.util.Optional;
 
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
 
import com.example.login.dao.UserRepository;
import com.example.login.entity.User;
 
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
 
    @Mock
    private UserRepository userRepo;
 
    @InjectMocks
    private AuthService authService;
 
    // ✅ ADMIN LOGIN TEST
    @Test
    void testAdminLogin() {
 
        User user =
            authService.login(
                "admin123@gmail.com",
                "1234"
            );
 
        assertNotNull(user);
        assertEquals("ADMIN", user.getRole());
    }
 
    // ✅ USER LOGIN SUCCESS
    @Test
    void testUserLoginSuccess() {
 
        User mockUser = new User();
 
        mockUser.setEmail("user@gmail.com");
        mockUser.setPassword("1111");
        mockUser.setRole("USER");
 
        when(userRepo.findByEmail("user@gmail.com"))
                .thenReturn(Optional.of(mockUser));
 
        User result =
            authService.login(
                "user@gmail.com",
                "1111"
            );
 
        assertNotNull(result);
        assertEquals("USER", result.getRole());
    }
 
    // ❌ INVALID LOGIN
    @Test
    void testInvalidLogin() {
 
        when(userRepo.findByEmail("wrong@gmail.com"))
                .thenReturn(Optional.empty());
 
        User result =
            authService.login(
                "wrong@gmail.com",
                "123"
            );
 
        assertEquals(null, result);
    }
 
    // ✅ SIGNUP SUCCESS
    @Test
    void testSignupSuccess() {
 
        User user = new User();
 
        user.setEmail("new@gmail.com");
 
        when(userRepo.findByEmail("new@gmail.com"))
                .thenReturn(Optional.empty());
 
        String result = authService.signup(user);
 
        assertEquals("Signup successful!", result);
    }
 
    // ❌ EMAIL ALREADY EXISTS
    @Test
    void testSignupExistingEmail() {
 
        User user = new User();
 
        user.setEmail("existing@gmail.com");
 
        when(userRepo.findByEmail("existing@gmail.com"))
                .thenReturn(Optional.of(user));
 
        String result = authService.signup(user);
 
        assertEquals("Email already exists!", result);
    }
 
    // ✅ RESET PASSWORD
    @Test
    void testResetPassword() {
 
        User user = new User();
 
        user.setEmail("user@gmail.com");
        user.setPassword("old");
 
        when(userRepo.findByEmail("user@gmail.com"))
                .thenReturn(Optional.of(user));
 
        String result =
            authService.resetPassword(
                "user@gmail.com",
                "new123"
            );
 
        assertEquals(
            "Password updated successfully!",
            result
        );
    }
}