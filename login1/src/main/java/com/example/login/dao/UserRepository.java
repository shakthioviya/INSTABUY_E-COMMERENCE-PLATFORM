package com.example.login.dao;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.login.entity.User;

import java.util.Optional;
 
public interface UserRepository extends JpaRepository<User, Long> {
 
    Optional<User> findByEmail(String email);
 
}