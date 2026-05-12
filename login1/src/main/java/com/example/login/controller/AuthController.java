package com.example.login.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.login.entity.User;
import com.example.login.security.JwtUtil;
import com.example.login.service.AuthService;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private JwtUtil jwtUtil;

    // ===================== 🔐 LOGIN — No token needed =====================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        User user = service.login(email, password);

        // ❌ Wrong email or password → 401 so frontend catch block triggers
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        // ✅ Success
        String token = jwtUtil.generateToken(user.getEmail(), user.getId());
        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "name",    user.getName(),
                "email",   user.getEmail(),
                "role",    user.getRole(),
                "token",   token,
                "userId",  user.getId()
        ));
    }

    // ===================== 📝 SIGNUP — No token needed =====================
    @PostMapping("/register")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            String result = service.signup(user);
            if (result.equals("Signup successful!")) {
                return ResponseEntity.ok(Map.of("message", result));
            } else {
                // ❌ Email already exists → 409 Conflict
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of("error", result));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    // ===================== 🔑 FORGOT PASSWORD — No token needed =====================
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String result = service.resetPassword(email, password);

        if (result.equals("User not found!")) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", result));
        }

        return ResponseEntity.ok(Map.of("message", result));
    }

    // ===================== 🔒 PROFILE — Token required =====================
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token);
            return ResponseEntity.ok(Map.of(
                    "message",    "Access granted!",
                    "loggedInAs", email
            ));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired token"));
        }
    }
}