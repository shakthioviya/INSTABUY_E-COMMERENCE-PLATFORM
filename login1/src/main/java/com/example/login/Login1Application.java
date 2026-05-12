package com.example.login;

import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class Login1Application {

	public static void main(String[] args) {
		SpringApplication.run(Login1Application.class, args);
	}

}
