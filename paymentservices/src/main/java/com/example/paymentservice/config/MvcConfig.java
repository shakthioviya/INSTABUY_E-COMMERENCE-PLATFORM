package com.example.paymentservice.config;
 
import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.boot.web.servlet.FilterRegistrationBean;

@Configuration

public class MvcConfig {

    @Bean

    public FilterRegistrationBean<JwtFilter> jwtFilter() {

        FilterRegistrationBean<JwtFilter> registrationBean =

                new FilterRegistrationBean<>();

        registrationBean.setFilter(new JwtFilter());

        registrationBean.addUrlPatterns("/api/payments/*"); // 🔥 protect all APIs

        return registrationBean;

    }

}
 