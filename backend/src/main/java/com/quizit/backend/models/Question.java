package com.quizit.backend.models;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "questions")
@EntityListeners(AuditingEntityListener.class)
public class Question{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "userId", nullable = false)
	@JsonBackReference(value = "user-question")
	private User user;
	
	@OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference(value = "question-answer")
	private List<Answer> answers;
	
	@ManyToMany(mappedBy = "favoriteQuestions")
    private List<User> favoritedByUsers = new ArrayList<>();
	
	@Column(length = 500)
	private String title;
	
	@Column(columnDefinition = "TEXT")
	private String question;
	
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
	
	public List< Answer> getAnswers(){
		return answers;
	}
	
	public String getTitle(){
		return title;
	}
		
	public String getQuestion(){
		return question;
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
	
	public void setAnswers(List<Answer> answers){
		this.answers = answers;
	}
	
	public void setTitle(String title){
		this.title = title;
	}
	
	public void setQuestion(String question){
		this.question = question;
	}
	
	public void setCreatedAt(LocalDateTime createdAt){
		this.createdAt = createdAt;
	}
	
	public void setUpdatedAt(LocalDateTime updatedAt){
		this.updatedAt = updatedAt;
	}
	
}