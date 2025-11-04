package com.quizit.backend.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.quizit.backend.models.Login;
import com.quizit.backend.models.User;
import com.quizit.backend.security.JwtUtil;
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
public class LoginController {

	@Autowired
	private UserService service;

	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@RequestBody Login login) {

//Initialize response Hashmap
		Map < String, Object> response = new HashMap<>();

//Check for valid email
		if (login.getEmail().isEmpty() || login.getEmail() == null) {
			response.put("status", "failure");
			response.put("message", "Invalid email");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

//User with email in database
		Optional<User> existingUser = service.getUserByEmail(login.getEmail());

//Check if user exists in database
		if (existingUser.isEmpty() ||  existingUser == null) {
			response.put("status", "failure");
			response.put("message", "User not found");
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		User user = existingUser.get();

//Check for valid password
		String password = login.getPassword();
		if (password.isEmpty() || password == null) {
			response.put("status", "failure");
			response.put("message", "Invalid password");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
//Check for password equality
		if (!BCrypt.checkpw(password, user.getPassword())) {
			response.put("status", "failure");
			response.put("message", "Incorrect email or password");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

// Generate token
		String token = jwtUtil.generateToken(user.getEmail());

//return user and JWT to  client
		response.put("status", "success");
		response.put("message", "Logged in successfully");
		response.put("token", token);
		response.put("username", user.getUsername());
		response.put("email", user.getEmail());
		response.put("id", user.getId());
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}