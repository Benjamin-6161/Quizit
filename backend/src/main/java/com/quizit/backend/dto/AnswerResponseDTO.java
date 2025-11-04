package com.quizit.backend.dto;

import java.time.LocalDateTime;

import com.quizit.backend.models.Answer;


public class AnswerResponseDTO {
    private Long id;
    private String answer;
    private Long questionId;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AnswerResponseDTO(Answer answer) {
        this.id = answer.getId();
        this.answer = answer.getAnswer();
        this.questionId = answer.getQuestion().getId();
        this.userId = answer.getUser().getId();
        this.username = answer.getUser().getUsername(); 
        this.createdAt = answer.getCreatedAt();
        this.updatedAt = answer.getUpdatedAt();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getAnswer() {
        return answer;
    }
    
    public Long getQuestionId() {
        return questionId;
    }
    
    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}