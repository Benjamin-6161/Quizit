package com.quizit.backend.services;

import java.util.Optional;

import com.quizit.backend.models.UserVerification;
import com.quizit.backend.repository.UserVerificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserVerificationService {
	
	@Autowired
	UserVerificationRepository repo;
	
	//get user to verify
	public Optional<UserVerification> getUserByEmail(String email){
		return repo.findOneByEmail(email);
	}
	
	//store user to verify
	public void saveUserToVerify(UserVerification user){
		repo.save(user);
	}
	
	//delete user from verification table
	public void removeUserFromVerificationTable(Long id){
		repo.deleteById(id);
	}
}