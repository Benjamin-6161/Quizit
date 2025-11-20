package com.quizit.backend.tasks;

import com.quizit.backend.repository.UserVerificationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class VerificationCleanupTask {

    private final UserVerificationRepository repo;

    public VerificationCleanupTask(UserVerificationRepository repo) {
        this.repo = repo;
    }

    // Runs every 30 minutes
    @Scheduled(cron = "0 */30 * * * *")
    public void cleanExpiredVerificationRows() {
        repo.deleteExpired(LocalDateTime.now());
        System.out.println("Cleaned expired OTP verification records");
    }
}