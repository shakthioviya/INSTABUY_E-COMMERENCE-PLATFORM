package com.example.inventory.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain)
            throws ServletException, IOException {
    	System.out.println("PATH HIT: " + request.getRequestURI());

    	String path = request.getRequestURI();
    	String method = request.getMethod();

    
    	if (isPublicPath(path, method)) {
    	    filterChain.doFilter(request, response);
    	    return;
    	}

    	
    	String authHeader = request.getHeader("Authorization");
    	if (authHeader == null || !authHeader.startsWith("Bearer ")) {
    	    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    	    return;
    	}
        

        String token = authHeader.substring(7);
        try {
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractEmail(token);
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                email, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }

 
    private boolean isPublicPath(String path, String method) {
        return path.startsWith("/api/dashboard/") || 
        		path.startsWith("/api/inventory/")       ||
               path.startsWith("/api/product/")         ||
               path.startsWith("/api/dealer/")          || 
                              
               path.startsWith("/uploads/")             ||
               path.contains("/swagger")                ||
               path.contains("/v3/api-docs")            ||
               method.equalsIgnoreCase("OPTIONS") ||
        path.equals("/error");

    }
}