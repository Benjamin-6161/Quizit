package com.quizit.backend.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "answers")
@EntityListeners(AuditingEntityListener.class)
public class Answer {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(columnDefinition = "TEXT")
	private String answer;
	
	@ManyToOne
	@JoinColumn(name = "questionId", nullable = false)
	@JsonBackReference(value = "question-answer")
	private Question question;
	
	@ManyToOne
	@JoinColumn(name = "userId", nullable = false)
	@JsonBackReference(value = "user-answer")
	private User user;
	
	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;
	
	@LastModifiedDate
	private LocalDateTime updatedAt;
	
	//getters
	public Long getId(){
		return id;
	}
	
	public User getUser(){
		return user;
	}
	
	public Question getQuestion(){
		return question;
	}
	
	public String getAnswer(){
		return answer;
	}
	
	public LocalDateTime getCreatedAt(){
		return createdAt;
	}
	
	public LocalDateTime getUpdatedAt(){
		return updatedAt;
	}
		
	//setters
	public void setId(Long id){
		this.id = id;
	}
	
	public void setUser(User user){
		this.user = user;
	}
	
	public void setQuestion(Question question){
		this.question = question;
	}
	
	public void setAnswer(String answer){
		this.answer = answer;
	}
	
	public void setCreatedAt(LocalDateTime createdAt){
		this.createdAt = createdAt;
	}
	
	public void setUpdatedAt(LocalDateTime updatedAt){
		this.updatedAt = updatedAt;
	}
}