package com.quizit.backend.repository;

import java.util.Optional;

import com.quizit.backend.models.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	
	//find user by email
	public Optional<User> findOneByEmail(String email);
	
	//find user by username
	public Optional<User> findOneByUsername(String username);

}