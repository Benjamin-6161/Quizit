package com.quizit.backend.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.quizit.backend.models.Answer;
import com.quizit.backend.models.Question;
import com.quizit.backend.models.User;
import com.quizit.backend.repository.UserRepository;
import com.quizit.backend.services.AnswerService;
import com.quizit.backend.services.AuthService;
import com.quizit.backend.services.QuestionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AnswerController {
	
	@Autowired
	AnswerService service;
	
	@Autowired
	QuestionService questionService;
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	AuthService authService;
	
	//Answer a question
	@PostMapping("questions/{questionId}/answer")
	public ResponseEntity<Map<String, String>> answerAQuestion(@PathVariable("questionId") Long questionId, @RequestBody Answer answer){
		
		//init response hashmap
	    Map<String, String> response = new HashMap<>();
	    
		//Check that all fields are filled
		if (answer.getAnswer() == null || answer.getAnswer().isEmpty()){
			response.put("status", "failure");
			response.put("message", "Answer cannot be blank");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		Question question = questionService.findQuestionById(questionId).get();
		
		//Check question in database
		if (question == null){
			response.put("status", "failure");
			response.put("message", "Question does not exist");
	    	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}	
		
		//Get currrent user
		User user = authService.getCurrentUser();			    
	    
	    //Add answer
	    answer.setQuestion(question);
	    answer.setUser(user);
	    
	    service.answerAQuestion(answer);
	    
	    response.put("status", "success");
		response.put("message", "Answer submitted successfully");
	    return new ResponseEntity<>(response, HttpStatus.CREATED);
	    
	}
	//Edit an answer
	@PutMapping("/questions/{questionId}/answers/{answerId}/edit")
	public ResponseEntity<Map<String, String>> editAnswer(@PathVariable("questionId") Long questionId, @PathVariable("answerId") Long answerId, @RequestBody Answer updatedAnswer){
		
		//init response HashMap
		Map<String, String> response = new HashMap<>();
		
		//check for question in database
		if (questionService.findQuestionById(questionId) == null){
			response.put("status", "failure");
			response.put("message", "Question does not exist");
	    	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		Optional<Answer> existingAnswerOpt = service.getAnswerById(answerId);
		
		//check for answer in database
		if (existingAnswerOpt.isEmpty()){
			response.put("status", "failure");
			response.put("message", "Answer with id does not exist");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}		
		
		Answer existingAnswer = existingAnswerOpt.get();
		
		//Validate current user
		User currentUser = authService.getCurrentUser();
		
		if (!existingAnswer.getUser().getId().equals(currentUser.getId())){
			response.put("status", "failure");
			response.put("message", "You cannot edit this answer");
			return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		}
		
		//Check that all fields are filled
		if (updatedAnswer.getAnswer() == null || updatedAnswer.getAnswer().isEmpty()){
			response.put("status", "failure");
			response.put("message", "Answer cannot be blank");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		//update answer
		existingAnswer.setAnswer(updatedAnswer.getAnswer());
		
		service.updateAnswer(existingAnswer);
		response.put("status", "success");
		response.put("message", "Answer updated successfully");
	    return new ResponseEntity<>(response, HttpStatus.OK);		
	}
	
	//Delete an answer
	@DeleteMapping("/questions/{questionId}/answers/{answerId}/delete")
	public ResponseEntity<Map<String, String>> deleteAnswer(@PathVariable("questionId") Long questionId, @PathVariable("answerId") Long answerId){
		
		//init response HashMap
		Map<String, String> response = new HashMap<>();
		
		//check for question in database
		if (questionService.findQuestionById(questionId) == null){
			response.put("status", "failure");
			response.put("message", "Question does not exist");
	    	return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		Optional<Answer> existingAnswer = service.getAnswerById(answerId);
		
		//check for answer in database
		if (existingAnswer.isEmpty()){
			response.put("status", "failure");
			response.put("message", "Answer with id does not exist");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		//Validate current user
		User currentUser = authService.getCurrentUser();
		
		if (!existingAnswer.get().getUser().getId().equals(currentUser.getId())){
			response.put("status", "failure");
			response.put("message", "You cannot delete this answer");
			return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		}
		
		
		
		//delete the answer
		service.deleteAnswerById(answerId);
		response.put("status", "success");
		response.put("message", "Answer deleted successfully");
	    return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
	}
}