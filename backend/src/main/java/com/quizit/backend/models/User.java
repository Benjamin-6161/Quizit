package com.quizit.backend.models;

import java.time.LocalDateTime;
import java.util.List;

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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String firstName;
	private String lastName;
	
	@Column(unique = true, nullable = false)
	private String username;
	
	@Column(unique = true, nullable = false)
	private String email;
	
	private String password;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference(value = "user-question")
	private List<Question> questions;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonManagedReference(value = "user-answer")
	private List<Answer> answers;
	
	@CreatedDate
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;
	
	@LastModifiedDate
	private LocalDateTime updatedAt;
	
	//getters
	public Long getId(){
		return id;
	}
	
	public String getFirstName(){
		return firstName;
	}
	
	public String getLastName(){
		return lastName;
	}
	
	public String getUsername(){
		return username;
	}
	
	public List<Question> getQuestions(){
		return questions;
	}
	
	public List<Answer> getAnswers(){
		return answers;
	}
			
	public String getEmail(){
		return email;
	}
		
	public String getPassword(){
		return password;
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
	
	public void setFirstName(String firstName){
		this.firstName = firstName;
	}
	
	public void setLastName(String lastName){
		this.lastName = lastName;
	}
	
	public void setUsername(String username){
		this.username = username;
	}
	
	public void setQuestions(List<Question> questions){
		this.questions = questions;
	}
	
	public void setAnswers(List<Answer> answers){
		this.answers = answers;
	}
	
	public void setPassword(String password){
		this.password = password;
	}
	
	public void setEmail(String email){
		this.email = email;
	}
	
	public void setCreatedAt(LocalDateTime createdAt){
		this.createdAt = createdAt;
	}
	
	public void setUpdatedAt(LocalDateTime updatedAt){
		this.updatedAt = updatedAt;
	}
}