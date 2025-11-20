package com.quizit.backend.controllers;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.quizit.backend.dto.UserResponseDTO;
import com.quizit.backend.models.User;
import com.quizit.backend.models.UserVerification;
import com.quizit.backend.security.JwtUtil;
import com.quizit.backend.services.EmailService;
import com.quizit.backend.services.UserService;
import com.quizit.backend.services.UserVerificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class VerificationController {
	
	@Autowired 
	UserVerificationService service;
	
	@Autowired
    private EmailService emailService;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserService userService;
	
	 //Secret Key
    @Value("${quizit.jwt.secret}")
    private String SECRET_KEY;
    
    //Google client id
    @Value("${google.client.id}")
    private String CLIENT_ID;
	
	//SAVE USER FOR VERIFICATION
	@PostMapping("/otp/request")
	public ResponseEntity<Map<String, Object>> processUserForVerification(@RequestParam("email") String email, @RequestParam("purpose") String purpose) throws NoSuchAlgorithmException, InvalidKeyException, IllegalStateException{
		
		//init response hashmap
		Map<String, Object> response = new HashMap<>();
		
		//Check that email field is present
		if (email == null || email.isEmpty()){
			response.put("status", "failure");
			response.put("message", "Invalid Email");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
	    
	    //generate OTP		
		SecureRandom secureRandom = new SecureRandom();
        int otp = secureRandom.nextInt(900000) + 100000;
        
        // Send OTP via Gmail
        try {
            emailService.sendOtpEmail(email, String.valueOf(otp));
        } 
        catch (Exception e) {
            response.put("status", "failure");
            response.put("message", "Failed to send OTP email. Try again later.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
}
        
        //FOR TESTING
        System.out.println("Your otp is: " + otp);        
        //FOR TESTING

        // Hash OTP with HmacSHA256
        SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
mac.init(key);
        String hashedOtp = Base64.getEncoder().encodeToString(mac.doFinal(String.valueOf(otp).getBytes()));
        
        //Check if user is currently under verification
        if (service.getUserByEmail(email).isPresent()){
        	UserVerification existingUser = service.getUserByEmail(email).get();
        	
        	//Check if last otp was sent more less than 60 seconds ago
            if (LocalDateTime.now().isBefore(existingUser.getLastSentAt().plusSeconds(60))){
            	response.put("status", "failure");
		    	response.put("message", "Wait for a while before requesting another OTP");
			
			    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
            //Check if user has Requested otp resend too many times
            if (existingUser.getResendAttemptsLeft() < 1){
            	
            	response.put("status", "failure");
		    	response.put("message", "Too many attempts. Try again later");
			
		    	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
            
        	existingUser.setHashedOtp(hashedOtp);
        	existingUser.setAttemptsLeft(3);
        	existingUser.setVerified(false);
        	existingUser.setResendAttemptsLeft(existingUser.getResendAttemptsLeft() - 1);
        	existingUser.setLastSentAt(LocalDateTime.now());
        	LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);
		    existingUser.setExpiresAt(expiry); 
		
        	service.saveUserToVerify(existingUser);
		    response.put("status", "success");
	    	response.put("message", "submitted for verification");
		
	    	return new ResponseEntity<>(response, HttpStatus.OK);
        }
		
		UserVerification user = new UserVerification();
		
		//store user for verification
		user.setEmail(email);
		user.setPurpose(purpose);
		user.setHashedOtp(hashedOtp);
		user.setAttemptsLeft(3);
		user.setVerified(false);
		user.setLastSentAt(LocalDateTime.now());
		user.setResendAttemptsLeft(3);
		
		LocalDateTime expiry = LocalDateTime.now().plusMinutes(5);
		user.setExpiresAt(expiry);
		
		service.saveUserToVerify(user);
		response.put("status", "success");
		response.put("message", "submitted for verification");
		
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	
	
	
	
	
	//VERIFY OTP
	@PostMapping("/otp/verify")
	public ResponseEntity<Map<String, Object>> verifyOtp(@RequestParam("email") String email, @RequestParam("otp") String otp) throws NoSuchAlgorithmException, InvalidKeyException, IllegalStateException{
		
		//init response hashmap
	    Map<String, Object> response = new HashMap<>();
	    
	    //check that user is stored for verification
	    if(!service.getUserByEmail(email).isPresent()){
	    	response.put("status", "failure");
			response.put("message", "Email not registered");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	    }
	    
	    //get User to verify
	    UserVerification existingUser = service.getUserByEmail(email).get();
	    
	    //verify otp length
	    if (otp.length() != 6){
	    	
	    	response.put("status", "failure");
			response.put("message", "Invalid OTP");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }
	    
	    //verify otp expiration
	    if (LocalDateTime.now().isAfter(existingUser.getExpiresAt())){
	       
	       response.put("status", "failure");
		   response.put("message", "Expired OTP");
			
			service.removeUserFromVerificationTable(existingUser.getId());
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	     } 
	     
	     //verify attempts
	     if (existingUser.getAttemptsLeft() < 1){
	        response.put("status", "failure");
			response.put("message", "Too many attempts, request another otp");
			
			service.removeUserFromVerificationTable(existingUser.getId());
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}	 	  	    	
	 	    
	    //Hash user entered otp
        SecretKeySpec key = new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
mac.init(key);
        String hashedUserOtp = Base64.getEncoder().encodeToString(mac.doFinal(otp.getBytes()));
        
        //compare otp to stored one 
        if (!existingUser.getHashedOtp().equals(hashedUserOtp)){
        	response.put("status", "failure");
			response.put("message", "Incorrect OTP");
			
			//reduce attempts left
			existingUser.setAttemptsLeft(existingUser.getAttemptsLeft() - 1);
			service.saveUserToVerify(existingUser);
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        
        existingUser.setVerified(true);
        
        service.saveUserToVerify(existingUser);
        
        response.put("status", "success");
        response.put("message", "Verified");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
  }
  
  
  
  
  
  //AUTHENTICATE USER WITH GOOGLE
  @PostMapping("/auth/google")
public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) throws GeneralSecurityException, IOException {
    
    //init response hashmap
    Map<String, Object> response = new HashMap<>();
    
    String credential = body.get("credential");

    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier
            .Builder(new NetHttpTransport(), new GsonFactory())
            .setAudience(Collections.singletonList(CLIENT_ID))
            .build();

    GoogleIdToken idToken = verifier.verify(credential);

    if (idToken != null) {
        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String googleId = payload.getSubject();
        String picture = (String) payload.get("picture");
        
        //Check that user email is verified
        if (!payload.getEmailVerified()) {
        	response.put("status", "failure");
		    response.put("message", "Unverified Email");
        
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        //Check if user exists in DB, otherwise create
        Optional<User> userOpt = userService.getUserByEmail(email);
        
        User user;
        
        //Check that user isnt already registered with email-password
        if (userOpt.isPresent() && !userOpt.get().getAccountType().equals("GOOGLE")) {
        	response.put("status", "failure");
		    response.put("message", "Email already registered with password. Login with password.");
        
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
}
        
        if (!userOpt.isPresent()){
        	user = new User();
        	
        	//create a unique temporary username
        	String baseUsername = email.split("@")[0];
        	int counter = 1;
        	String finalUsername = baseUsername;
        	
        	while (userService.getUserByUsername(finalUsername).isPresent()){
        		finalUsername = baseUsername + counter;
        		counter ++;
        	}
        	
        	user.setUsername(finalUsername);  
        	user.setFirstName(name);
        	user.setEmail(email);
        	user.setAccountType("GOOGLE");
        	user.setGoogleId(googleId);
        	user.setPassword(null);
        	
        	userService.registerUser(user);
        }
        
        else{
        	user = userOpt.get();
        }
        
        UserResponseDTO userDto = new UserResponseDTO(user);

        //Generate JWT
        String jwt = jwtUtil.generateToken(user.getEmail().toString());
        
        response.put("token", jwt);
        response.put("status", "success");
		response.put("message", "Logged in successfully");
		response.put("details", userDto);

        return new ResponseEntity<>(response, HttpStatus.OK);

    } else {
        response.put("status", "failure");
		response.put("message", "Invalid google token");
        
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
}
}