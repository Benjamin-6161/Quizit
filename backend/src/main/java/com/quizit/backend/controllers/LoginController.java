package com.quizit.backend.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.quizit.backend.dto.UserResponseDTO;
import com.quizit.backend.models.Login;
import com.quizit.backend.models.User;
import com.quizit.backend.security.JwtUtil;
import com.quizit.backend.services.UserService;
import com.quizit.backend.services.UserVerificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class LoginController {

	@Autowired
	private UserService userService;
	
	@Autowired
	private UserVerificationService userVerificationService;

	@Autowired
	private JwtUtil jwtUtil;


    //USER LOGIN
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
		Optional<User> existingUser = userService.getUserByEmail(login.getEmail());

        //Check if user exists in database
		if (!existingUser.isPresent()) {
			response.put("status", "failure");
			response.put("message", "User not found");
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		User user = existingUser.get();
		
		// Ensure user isnt a google authenticated user
		if (user.getAccountType() != null && user.getAccountType().equals("GOOGLE")){
			response.put("status", "failure");
			response.put("message", "Email authenticated with google. Click sign in with google to login");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		//Check for valid password
		String password = login.getPassword();
		if (password == null || password.isEmpty()) {
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
        UserResponseDTO userDto = new UserResponseDTO(user);

		response.put("status", "success");
		response.put("message", "Logged in successfully");
		response.put("token", token);
		response.put("details", userDto);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	
	
	
	
	//FORGOT PASSWORD
	@PutMapping("/password/reset")
	public ResponseEntity<Map<String, String>> forgotPasssword(@RequestParam("email") String email, @RequestParam("password") String newPassword){
		
		//init response hashmap
		Map<String, String> response = new HashMap<>();
		
		//check for empty fields
		if (email == null || email.isEmpty() || newPassword == null || newPassword.isEmpty()){
			response.put("status", "failure");
			response.put("message", "Fields cannot be empty");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		//confirm that user exists
		if (!userService.getUserByEmail(email).isPresent()){
			response.put("status", "failure");
			response.put("message", "Email not registered");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		//Confirm that user is not a google Authenticated user
		if (userService.getUserByEmail(email).get().getAccountType().equals("GOOGLE")){
			
			response.put("status", "failure");
			response.put("message", "Cannot set password, Use 'Sign in to Google' to sign in");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		//confirm that user otp has been verified
		if (!userVerificationService.getUserByEmail(email).isPresent() || userVerificationService.getUserByEmail(email).get().IsVerified() == false){
			response.put("status", "failure");
			response.put("message", "Verify email first");
			
			return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		}
		
		//hash password
		String hashedPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());
		
		//get user and update password
		User user = userService.getUserByEmail(email).get();
		
		user.setPassword(hashedPassword);
		
		userService.registerUser(user);
		
		response.put("status", "success");
		response.put("message", "Password changed successfully");
			
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}