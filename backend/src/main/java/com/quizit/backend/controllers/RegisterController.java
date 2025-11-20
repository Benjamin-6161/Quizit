package com.quizit.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import com.quizit.backend.models.User;
import com.quizit.backend.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class RegisterController {
	
	@Autowired
	UserService service;
	
	@PostMapping("/register")
	public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user){
		
		Map <String, String> response = new HashMap<>();
		//Check that all fields are filled
		if (user.getFirstName().isEmpty() || user.getLastName().isEmpty() || user.getUsername().isEmpty() || user.getEmail().isEmpty() || user.getPassword().isEmpty()){
			response.put("status", "failed");
			response.put("message", "All fields must be filled");
			return new ResponseEntity<> (response, HttpStatus.BAD_REQUEST);
		}
		
		//Check that email has not been used before
		if (service.getUserByEmail(user.getEmail()).isPresent()){
			response.put("status", "failed");
			response.put("message", "Email already registered");
			return new ResponseEntity<> (response, HttpStatus.CONFLICT);		
		}
		
		//Check that username has not been used
		if  (service.getUserByUsername(user.getUsername()).isPresent()){
			response.put("status", "failed");
			response.put("message", "Username already exists");
			return new ResponseEntity<> (response, HttpStatus.CONFLICT);
		}
		
		//Encrypt password
		String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());
		
	    //Register user
	    User newUser = new User();
	    
	    newUser.setFirstName(user.getFirstName());
	    newUser.setLastName(user.getLastName());
	    newUser.setUsername(user.getUsername());
	    newUser.setAccountType("EMAIL-PASSWORD");
	    newUser.setEmail(user.getEmail());
	    newUser.setPassword(hashedPassword); 
	    
	    service.registerUser(newUser);
	    response.put("status", "success");
	    response.put("message", "User registered successfully");
	    return new ResponseEntity<> (response, HttpStatus.OK);  
	}
}