package com.example.paymentservice.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.security.Key;

public class JwtFilter extends OncePerRequestFilter {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey12"; // ✅ must match login!
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                Long userId = claims.get("userId", Long.class);
                if (userId != null) {
                    request.setAttribute("userId", userId);
                    System.out.println("✅ JWT valid - userId set: " + userId);
                }

            } catch (Exception e) {
                // ⚠️ Token invalid/expired — but we still continue, never block
                System.out.println("⚠️ JWT parse failed: " + e.getMessage());
            }
        }

        // ✅ ALWAYS continue — never blocks any request
        filterChain.doFilter(request, response);
    }
}