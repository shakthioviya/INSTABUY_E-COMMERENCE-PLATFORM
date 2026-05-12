package com.example.paymentservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private Map<String, OtpEntry> otpStorage = new ConcurrentHashMap<>();

    @Autowired
    private JavaMailSender mailSender;

    public String generateOtp(String email, Long orderId, Long userId,
                              double amount, String paymentType) {

        // ✅ CHANGED — key uses orderId only, not email
        String key = orderId != null ? "ORDER_" + orderId : "TOPUP_" + email;

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpStorage.put(key, new OtpEntry(
                otp,
                LocalDateTime.now(),
                userId,
                amount,
                paymentType
        ));

        System.out.println("OTP for " + email + " (Order " + orderId + ") is: " + otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("tanuja8725@gmail.com");
            message.setTo(email);
            message.setSubject("Your Payment OTP");
            message.setText("Your OTP is: " + otp);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending OTP email: " + e.getMessage());
            return "Failed to send OTP";
        }
        return "OTP sent successfully";
    }

    public OtpEntry verifyOtp(String email, Long orderId, String enteredOtp) {

        // ✅ CHANGED — same key logic as generateOtp
        String key = orderId != null ? "ORDER_" + orderId : "TOPUP_" + email;

        OtpEntry entry = otpStorage.get(key);

        if (entry == null) {
            System.out.println("❌ OTP not found for key: " + key);
            return null;
        }

        // Expiry check (5 minutes)
        if (entry.getGeneratedAt().plusMinutes(5).isBefore(LocalDateTime.now())) {
            otpStorage.remove(key);
            System.out.println("❌ OTP expired for key: " + key);
            return null;
        }

        if (!entry.getOtp().equals(enteredOtp)) {
            System.out.println("❌ OTP mismatch for key: " + key);
            return null;
        }

        otpStorage.remove(key);
        System.out.println("✅ OTP verified for orderId: " + orderId);
        return entry;
    }

    public static class OtpEntry {

        private final String otp;
        private final LocalDateTime generatedAt;
        private final Long userId;
        private final double amount;
        private final String paymentType;

        public OtpEntry(String otp, LocalDateTime generatedAt,
                        Long userId, double amount, String paymentType) {
            this.otp = otp;
            this.generatedAt = generatedAt;
            this.userId = userId;
            this.amount = amount;
            this.paymentType = paymentType;
        }

        public String getOtp() { return otp; }
        public LocalDateTime getGeneratedAt() { return generatedAt; }
        public Long getUserId() { return userId; }
        public double getAmount() { return amount; }
        public String getPaymentType() { return paymentType; }
    }
}