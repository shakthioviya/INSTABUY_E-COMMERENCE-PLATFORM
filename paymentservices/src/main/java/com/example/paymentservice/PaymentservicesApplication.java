package com.example.paymentservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class PaymentservicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaymentservicesApplication.class, args);
	}

}
