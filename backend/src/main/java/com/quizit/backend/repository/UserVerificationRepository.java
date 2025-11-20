package com.quizit.backend.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import com.quizit.backend.models.UserVerification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional;

@Repository
public interface UserVerificationRepository extends JpaRepository<UserVerification, Long>{
	
	//find user by email
	public Optional<UserVerification> findOneByEmail(String email);
	
	//Delete users periodically
  @Modifying
  @Transactional
  @Query("DELETE FROM UserVerification u WHERE u.expiresAt < :now")
  void deleteExpired(@Param("now") LocalDateTime now);
}