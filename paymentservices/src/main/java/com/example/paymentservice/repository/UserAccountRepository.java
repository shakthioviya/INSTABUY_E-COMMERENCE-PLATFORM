package com.example.paymentservice.repository;
 
 
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
 
import com.example.paymentservice.entity.UserAccount;
 
import java.util.Optional;
 
@Repository

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

   Optional<UserAccount> findByUserId(Long userId);

}

 