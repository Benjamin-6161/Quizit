package com.quizit.backend.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.quizit.backend.dto.QuestionResponseDTO;
import com.quizit.backend.models.Question;
import com.quizit.backend.models.User;
import com.quizit.backend.repository.UserRepository;
import com.quizit.backend.services.AuthService;
import com.quizit.backend.services.QuestionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.micrometer.common.lang.NonNull;

@RestController
@RequestMapping("/api/v1")
public class QuestionController {

	@Autowired
	QuestionService service;

	@Autowired
	UserRepository userRepo;
	
	@Autowired
	AuthService authService;

	//Create a question
	@PostMapping("/createQuestion")
	public ResponseEntity<Map<String, String>> createQuestion(@RequestBody Question question) {

		//Initialize response HashMap
		Map<String, String> response = new HashMap<>();

		//Check that all fields are filled
		if (question.getTitle() == null || question.getQuestion() == null) {
			response.put("status", "failure");
			response.put("message", "Question and Title fields cannot be empty");

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		

		//Set user
		User user  = authService.getCurrentUser();

		User existingUser = userRepo.findById(user.getId()).orElse(null);

		if (user == null || user.getId() == null || existingUser == null) {
			response.put("status", "failure");
			response.put("message", "User not found");

			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		question.setUser(user);

		service.addQuestion(question);
		response.put("status", "success");
		response.put("message", "Question created successfully");

		return new ResponseEntity<>(response, HttpStatus.CREATED);

	}

	//GET ALL QUESTIONS
	@GetMapping("/questions")
public ResponseEntity<List<QuestionResponseDTO>> getAllQuestions() {
    List<QuestionResponseDTO> questions = service.getAllQuestions()
        .stream()
        .map(QuestionResponseDTO::new)
        .toList();

    return ResponseEntity.ok(questions);
}

    //GET A QUESTION BY ID
    @GetMapping("/questions/{questionId}")
    public ResponseEntity<Map<String, Object>> getQuestionById(@PathVariable("questionId") Long questionId){
    	
    	//init response Hashmap
    	Map<String, Object> response = new HashMap<>();
    	
    	Optional<Question> question = service.findQuestionById(questionId);
    	
    	//check that question exists
    	if (question.isEmpty()){
    		response.put("status", "failure");
    		response.put("message", "Question with id does not exist");
    		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    	}
    	
    	QuestionResponseDTO questionDTO = new QuestionResponseDTO(question.get()); 
    	response.put("status", "success");
    	response.put("message", "Success");
    	response.put("question", questionDTO);   
    	return new ResponseEntity<>(response, HttpStatus.OK);  	
    }

	//Get Questions by userId
	@GetMapping("/questions/user/{userId}")
	public List<QuestionResponseDTO> getQuestionsByUserId(@PathVariable("userId") Long userId) {
		List<QuestionResponseDTO> questions = service.findQuestionsByUserId(userId)
		.stream()
		.map(QuestionResponseDTO::new)
        .toList();
        
        return questions;
	}

	//EDIT A QUESTION
	@PutMapping("/editQuestion/{questionId}")
	public ResponseEntity<Map<String, String>> editQuestion(@PathVariable("questionId") Long questionId, @NonNull @RequestBody Question updatedQuestion) {

		//init response hashmap
		Map<String, String> response = new HashMap<>();

		Optional<Question> oldQuestionOpt = service.findQuestionById(questionId);

		//Check that question with that id exists
		if (oldQuestionOpt.isEmpty()) {
			response.put("status", "failure");
			response.put("message", "Question with this id does not exist");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		//Validate current user
		User currentUser = authService.getCurrentUser();
		
		if (!oldQuestionOpt.get().getUser().getId().equals(currentUser.getId())){
			response.put("status", "failure");
			response.put("message", "You cannot edit this question");
			return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		}
		
		//Check that all fields are filled
		if (updatedQuestion.getTitle().trim().isEmpty() || updatedQuestion.getQuestion() .trim().isEmpty()){
			response.put("status", "failure");
			response.put("message", "Question and Title fields must be filled");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}

		//Edit Question
		Question oldQuestion = oldQuestionOpt.get();
		oldQuestion.setTitle(updatedQuestion.getTitle());
		oldQuestion.setQuestion(updatedQuestion.getQuestion());

		service.addQuestion(oldQuestion);

		response.put("status", "success");
		response.put("message", "Question updated successfully");

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	//DELETE A QUESTION
	@DeleteMapping("/deleteQuestion/{questionId}")
	public ResponseEntity<Map<String, String>> deleteQuestion(@PathVariable("questionId") Long questionId) {

		//init response hashmap
		Map<String, String> response = new HashMap<>();

		//Check that question with that id exists
		Optional<Question> existingQuestion = service.findQuestionById(questionId);  
		if (existingQuestion.isEmpty()) {
			response.put("status", "failure");
			response.put("message", "Question with this id does not exist");
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		//Validate current user
		User currentUser = authService.getCurrentUser();
		
		if (!existingQuestion.get().getUser().getId().equals(currentUser.getId())){
			response.put("status", "failure");
			response.put("message", "You cannot delete this question");
			return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
		}

		//Delete the question
		service.deleteQuestionById(questionId);

		response.put("status", "success");
		response.put("message", "Question deleted successfully");

		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	//FAVORITE A QUESTION
	@PutMapping("/question/{questionId}/{userId}/favorite")
	public ResponseEntity<Map<String, String>> favoriteAQuestion(@PathVariable("questionId") Long questionId, @PathVariable("userId") Long userId){
		
		//init response hashmap
		Map<String, String> response = new HashMap<>();
		
		//get current user
		Optional<User> currentUserOpt = userRepo.findById(userId);
		
		if (!currentUserOpt.isPresent()){
			response.put("status", "failure");
			response.put("message", "User not found");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		User currentUser = currentUserOpt.get();
		
		//get question
		Optional<Question> questionOpt = service.findQuestionById(questionId);
		
		if (!questionOpt.isPresent()){
			response.put("status", "failure");
			response.put("message", "Question not found");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		Question question = questionOpt.get();
		
		//get user favorites
		List<Question> userFavorites = currentUser.getFavoriteQuestions();
		
		//check that question isnt already in favorites
		boolean alreadyFavorited = userFavorites.stream().anyMatch(q -> q.getId().equals(questionId));
		
		if (alreadyFavorited){
			response.put("status", "failure");
			response.put("message", "Question already in favorites");
			
			return new ResponseEntity<>(response, HttpStatus.CONFLICT);
		}
		
		//add question to user favorites
		userFavorites.add(question);
		
		currentUser.setFavoriteQuestions(userFavorites);
		
		userRepo.save(currentUser);
		
		response.put("status", "success");
		response.put("message", "Added to favorites");
			
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	//REMOVE A QUESTION FROM FAVORITES
	@PutMapping("/question/{questionId}/{userId}/favorite/remove")
	public ResponseEntity<Map<String, String>> removeQuestionFromFavorites(@PathVariable("questionId") Long questionId, @PathVariable("userId") Long userId){
		
		//init response hashmap
		Map <String, String> response = new HashMap<>();
		
		 //check that question exists 
		 Optional<Question> questionOpt = service.findQuestionById(questionId);
		
		if (!questionOpt.isPresent()){
			response.put("status", "failure");
			response.put("message", "Question not found");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		//get current user
		Optional<User> currentUserOpt = userRepo.findById(userId);
		
		if (!currentUserOpt.isPresent()){
			response.put("status", "failure");
			response.put("message", "User not found");
			
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}
		
		User currentUser = currentUserOpt.get();
		
		//get user favorites
		List<Question> userFavorites = currentUser.getFavoriteQuestions();
		
		//check that question is in favorites
		boolean alreadyFavorited = userFavorites.stream().anyMatch(q -> q.getId().equals(questionId));
		
		if (!alreadyFavorited){
			response.put("status", "failure");
			response.put("message", "Question is not in favorites");
			
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
		
		//remove the question from favorites
		userFavorites.removeIf(q -> q.getId().equals(questionId));
		
		currentUser.setFavoriteQuestions(userFavorites);
		
		userRepo.save(currentUser);
		
		response.put("status", "success");
		response.put("message", "Removed from favorites");
			
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}