import React, { useState } from "react";
import { toast } from "react-toastify";
import { editAQuestion } from "../../services/question.js";
import { useNavigate } from "react-router-dom";
import './EditQuestionPage.css';

function CreateQuestion() {
  
  const questionId = localStorage.getItem("questionId");
  const question = localStorage.getItem("question");
  const title = localStorage.getItem("title");
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: title,
    question: question,
  });

  const handleEditQuestion = async () => {
    //Validate fields
    if (!formData.title.trim() || !formData.question.trim()) {
      toast.error("All fields must be filled");
      return;
    }
    
    if (formData.title.length > 200){
      toast.error("Title is too long");
      return;
    }
    
    if (formData.question.length > 5000){
      toast.error("Question is too long");
      return;
    }
    
    // Send request
    try {
      const response = await editAQuestion(formData, questionId);
      toast.success(response.data.message || "Question updated successfully!");
      navigate(`/question/${questionId}`);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to update question, please try again later"
      );
    }
  };

  return (
    <div className="edit-container">
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title..."
        type="text"
        className="edit-title-input"
      />

      <textarea
        value={formData.question}
        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
        placeholder="What's on your mind?"
        className="edit-question-input"
      />

      <button onClick={handleEditQuestion} className="edit-button">
        Edit
      </button>
    </div>
  );
}

export default CreateQuestion;