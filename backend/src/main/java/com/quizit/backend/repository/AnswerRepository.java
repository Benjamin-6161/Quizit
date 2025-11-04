package com.quizit.backend.repository;

import com.quizit.backend.models.Answer;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, Long>{
	
	
}