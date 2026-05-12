package com.example.paymentservice;
 
import io.jsonwebtoken.Jwts;
 
import io.jsonwebtoken.security.Keys;

import java.security.Key;
 
import java.util.Date;

public class TestJwt {

    public static void main(String[] args) {

        String secret = "mysecretkeymysecretkeymysecretkey";
 
        Key key = Keys.hmacShaKeyFor(secret.getBytes());

        String token = Jwts.builder()
 
                .setSubject("2")
 
                .setIssuedAt(new Date())
 
                .setExpiration(new Date(System.currentTimeMillis() + 3600000))
 
                .signWith(key)
 
                .compact();

        System.out.println(token);
 
    }
 
}

 