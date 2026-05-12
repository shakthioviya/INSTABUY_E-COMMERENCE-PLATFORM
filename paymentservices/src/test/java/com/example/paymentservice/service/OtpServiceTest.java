package com.example.paymentservice.service;
 
import static org.junit.jupiter.api.Assertions.assertNotNull;
 
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
 
@ExtendWith(MockitoExtension.class)
public class OtpServiceTest {
 
    @Mock
    private JavaMailSender mailSender;
 
    @InjectMocks
    private OtpService otpService;
 
    @Test
    void testGenerateOtp() {
 
        String result =
                otpService.generateOtp(
                        "user@gmail.com",
                        1L,
                        1L,
                        5000,
                        "UPI"
                );
 
        assertNotNull(result);
    }
 
    @Test
    void testVerifyOtp() {
 
        otpService.generateOtp(
                "user@gmail.com",
                1L,
                1L,
                5000,
                "UPI"
        );
 
        OtpService.OtpEntry entry =
                otpService.verifyOtp(
                        "user@gmail.com",
                        1L,
                        "000000"
                );
 
        // invalid OTP returns null
    }
}