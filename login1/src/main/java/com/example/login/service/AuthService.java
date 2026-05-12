package com.example.login.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.login.dao.UserRepository;
import com.example.login.entity.User;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    // 🔐 LOGIN
    public User login(String email, String password) {

        Optional<User> optionalUser = userRepo.findByEmail(email);

        // ❌ Email not found
        if (optionalUser.isEmpty()) {
            return null; // → "Invalid credentials"
        }

        User user = optionalUser.get();

        // ❌ Wrong password
        if (!user.getPassword().equals(password)) {
            return null; // → "Invalid credentials"
        }

        // ✅ Ensure role exists
        if (user.getRole() == null) {
            user.setRole("USER");
        }

        return user; // ✅ Login success
    }

    // 📝 SIGNUP
    public String signup(User user) {

        // ❌ Email already registered
        Optional<User> existingUser = userRepo.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already exists!";
        }

        user.setRole("USER");
        userRepo.save(user);
        return "Signup successful!";
    }

    // 🔑 RESET PASSWORD
    public String resetPassword(String email, String newPassword) {

        Optional<User> user = userRepo.findByEmail(email);

        if (user.isPresent()) {
            user.get().setPassword(newPassword);
            userRepo.save(user.get());
            return "Password updated successfully!";
        }

        return "User not found!";
    }
}