package com.quizit.backend.services;

import java.util.List;
import java.util.Optional;

import com.quizit.backend.models.Question;
import com.quizit.backend.repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {
	
	@Autowired
	QuestionRepository repo;
	
	//Add a question
	public void addQuestion(Question question){
		repo.save(question);
	}
	
	//Get all questions
	public List<Question> getAllQuestions(){
		
		return repo.findAll();
	}
	
	//Get question by question id
	public Optional<Question> findQuestionById(Long id){
		return repo.findById(id);
	}
	
	//Get all questions by a user
	public List<Question> findQuestionsByUserId(Long userId){
		
		return repo.findByUserId(userId) ; 
	}
	
	//Delete question by Id
	public void deleteQuestionById(Long id){
		repo.deleteById(id);
	}
}