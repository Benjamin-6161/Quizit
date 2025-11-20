package com.quizit.backend.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.quizit.backend.models.User;

public class UserResponseDTO {
	
	private Long id;
	private String username;
	private String email;
	private List<QuestionResponseDTO> questions;
	private List<QuestionResponseDTO> favoriteQuestions;
	
	public UserResponseDTO(User user){
		this.id = user.getId();
		this.username = user.getUsername();
		this.email = user.getEmail();
		
		if (user.getQuestions() != null){
			this.questions = user.getQuestions().stream().map(QuestionResponseDTO::new).collect(Collectors.toList());
		}
		
		if (user.getFavoriteQuestions() != null){
	  	this.favoriteQuestions = user.getFavoriteQuestions().stream().map(QuestionResponseDTO::new).collect(Collectors.toList());
		}
	}
	
	//getters
	public Long getId(){
		return id;
	}
	
	public String getUsername(){
		return username;
	}
	
	public String getEmail(){
		return email;
	}
	
	public List<QuestionResponseDTO> getQuestions(){
		return questions;
	}
	
	public List<QuestionResponseDTO> getFavoriteQuestions(){
		return favoriteQuestions;
	}
}