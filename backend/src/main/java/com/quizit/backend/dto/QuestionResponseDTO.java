package com.quizit.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.quizit.backend.models.Answer;
import com.quizit.backend.models.Question;

public class QuestionResponseDTO {
    private Long id;
    private String title;
    private String question;
    private String username;
    private Long userId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AnswerResponseDTO> answers;

    //Build constructor from a question entity
    public QuestionResponseDTO(Question question) {
        this.id = question.getId();
        this.title = question.getTitle();
        this.question = question.getQuestion();
        this.username = question.getUser().getUsername();
        this.userId = question.getUser().getId();
        this.createdAt = question.getCreatedAt();
        this.updatedAt = question.getUpdatedAt();
        
    
        if (question.getAnswers() != null) {
            this.answers = question.getAnswers()
                .stream()
                .map(AnswerResponseDTO::new)
                .collect(Collectors.toList());
        }
    }

    // getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getQuestion() {
        return question;
    }

    public String getUsername() {
        return username;
    }
    
    public Long getUserId(){
    	return userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<AnswerResponseDTO> getAnswers() {
        return answers;
    }
}