package com.example.orderservice.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.security.Key;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey12";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/swagger-ui")       ||
               path.startsWith("/v3/api-docs")       ||
               path.startsWith("/api-docs")          ||
               path.startsWith("/webjars")           ||
               path.startsWith("/swagger-resources") ||
               
               path.equals("/error");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("=== JwtFilter triggered ===");
        System.out.println("Auth header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String token = authHeader.substring(7);
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                Long userId = claims.get("userId", Long.class);
                String username = claims.getSubject();
                System.out.println("userId from JWT: " + userId);

                if (userId != null && SecurityContextHolder.getContext()
                                                           .getAuthentication() == null) {

                    // ✅ Set userId as request attribute
                    request.setAttribute("userId", userId);

                    // ✅ Set authentication in SecurityContext
                    // so Spring Security allows the request through
                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                            username,    // principal
                            null,        // credentials
                            new ArrayList<>() // authorities (empty = no roles needed)
                        );
                    authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                            .buildDetails(request)
                    );
                    SecurityContextHolder.getContext()
                                        .setAuthentication(authentication); // ✅ KEY LINE
                    System.out.println("✅ SecurityContext set for userId: " + userId);
                }

            } catch (Exception e) {
                System.out.println("❌ JWT parse failed: " + e.getMessage());
            }
        }
        filterChain.doFilter(request, response);
    }
}