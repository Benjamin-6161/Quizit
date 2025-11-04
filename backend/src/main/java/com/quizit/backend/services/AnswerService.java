package com.quizit.backend.services;

import java.util.Optional;

import com.quizit.backend.models.Answer;
import com.quizit.backend.repository.AnswerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnswerService {
    
    @Autowired
    AnswerRepository repo;
    
    public void answerAQuestion(Answer answer){
    	repo.save(answer);
    }
    
    public void updateAnswer(Answer answer){
    	repo.save(answer);
    }
    
    public Optional<Answer> getAnswerById(Long answerId){
    	return repo.findById(answerId);
    }
    
    public void deleteAnswerById(Long answerId){
    	repo.deleteById(answerId);
    }
}