package com.example.inventory.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.inventory.entity.Dealer;
import com.example.inventory.entity.Inventory;
public interface DealerRepository extends JpaRepository<Dealer, Long> {
    Dealer findByEmail(String email);
}