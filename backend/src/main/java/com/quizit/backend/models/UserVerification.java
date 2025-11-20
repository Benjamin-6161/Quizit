package com.quizit.backend.models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_verification")
@EntityListeners(AuditingEntityListener.class)
public class UserVerification {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(unique = true, nullable = false)
	private String email;
	private boolean verified;
	private String hashedOtp;
	private String purpose; //Registration, forgot password, 2FA
	private int attemptsLeft;
	private int resendAttemptsLeft;
	private LocalDateTime expiresAt;
	private LocalDateTime lastSentAt;
	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;
	
	//getters
	public Long getId(){
		return id;
	}
	
	public String getEmail(){
		return email;
	}
	
	public String getHashedOtp(){
		return hashedOtp;
	}
	
	public String getPurpose(){
		return purpose;
	}
	
	public boolean IsVerified(){
		return verified;
	}
	
	public int getAttemptsLeft(){
		return attemptsLeft;
	}
	
	public int getResendAttemptsLeft(){
		return resendAttemptsLeft;
	}
	
	public LocalDateTime getLastSentAt(){
		return lastSentAt;
	}
	
	public LocalDateTime getExpiresAt(){
		return expiresAt;
	}
	
	public LocalDateTime getCreatedAt(){
		return createdAt;
	}
	
	//setters
	
	public void setId(Long id){
		this.id = id;
	}
	
	public void setEmail(String email){
		this.email = email;
	}
	
	public void setHashedOtp(String hashedOtp){
		this.hashedOtp = hashedOtp;
	}
	
	public void setVerified(boolean verified){
		this.verified = verified;
	}
	
	public void setLastSentAt(LocalDateTime lastSentAt){
		this.lastSentAt = lastSentAt;
	}
	
	public void setPurpose(String purpose){
		this.purpose = purpose;
	}
	
	public void setAttemptsLeft(int attemptsLeft){
		this.attemptsLeft = attemptsLeft;
	}
	
	public void setResendAttemptsLeft(int resendAttemptsLeft){
		this.resendAttemptsLeft = resendAttemptsLeft;
	}
	
	public void setExpiresAt(LocalDateTime expiresAt){
		this.expiresAt = expiresAt;
	}
	
	public void setCreatedAt(LocalDateTime createdAt){
		this.createdAt = createdAt;
	}
}