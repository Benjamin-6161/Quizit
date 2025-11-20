package com.quizit.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import com.quizit.backend.dto.UserResponseDTO;
import com.quizit.backend.models.User;
import com.quizit.backend.repository.UserRepository;
import com.quizit.backend.services.AuthService;
import com.quizit.backend.services.UserService;


import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1") 
@RestController
public class UserController {

	@Autowired
	UserService userService;
	
	@Autowired
	AuthService authService;
	
	//GET USER DETAILS
	@GetMapping("/user/{userId}")
	public ResponseEntity<Map<String, Object>> getUserDetails(@PathVariable("userId") Long userId){
		
		//init response hashmap
		Map<String, Object> response = new HashMap<>();
		
		//Check for user in database
		if (userId == null || !userService.getUserById(userId).isPresent()){
			response.put("status", "failed");
			response.put("message", "User not found");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		UserResponseDTO user = new UserResponseDTO(userService.getUserById(userId).get());
		
		response.put("status", "success");
		response.put("details", user);
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	
	
	
	
	//EDIT USER DETAILS
	@PutMapping("/edit/user/{userId}")
	public ResponseEntity<?> editUserDetails(@PathVariable("userId") Long userId, @RequestParam("username") String username){
		
		//init response hashmap
		Map<String, String> response = new HashMap<>();
		
		//confirm user exists
		if (userId == null || !userService.getUserById(userId).isPresent()){
			response.put("status", "failed");
			response.put("message", "User not found");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		//Get existing user
		User user = userService.getUserById(userId).get();
		
		//Validate input fields
		if(username.isEmpty()){
			response.put("status", "failed");
			response.put("message", "Fill all fields to edit");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		//Check that there is no conflict in db
		if (userService.getUserByUsername(username).isPresent()){
			response.put("status", "failed");
			response.put("message", "Username already exists");
			
			return new ResponseEntity<>(response, HttpStatus.CONFLICT);
		}
		
		//confirm and Authorize current user
		if (authService.getCurrentUser().getId() != userId){
			response.put("status", "failed");
			response.put("message", "Cannot authotize user to edit account");
			
			return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		}
		
		//update user details
		user.setUsername(username);
		userService.registerUser(user);
		
		response.put("status", "success");
	    response.put("message", "Details updated successfully");
			
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	
	
	
	//REMOVE USER ACCOUNT
	@DeleteMapping("/{userId}/delete")
	public ResponseEntity<Map<String, String>> deleteUserAccount(@PathVariable("userId") Long userId){
		//init response HashMap
		Map <String, String> response = new HashMap<>();
		
		//Check for user in database
		if (userId == null || !userService.getUserById(userId).isPresent()){
			response.put("status", "failed");
			response.put("message", "User not found");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		//confirm and Authorize current user
		if (authService.getCurrentUser().getId() != userId){
			response.put("status", "failed");
			response.put("message", "Cannot authotize user to delete account");
			
			return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		}
		
		//delete user
		userService.deleteUser(userId);
		
		response.put("status", "success");
		response.put("message", "User deleted successfully");
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}