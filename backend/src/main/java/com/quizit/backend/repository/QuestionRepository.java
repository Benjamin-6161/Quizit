package com.quizit.backend.repository;

import java.util.List;

import com.quizit.backend.models.Question;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long>{
	
	public List<Question> findByUserId(Long userId);
	
}