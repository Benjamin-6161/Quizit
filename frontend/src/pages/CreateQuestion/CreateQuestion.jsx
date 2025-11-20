import { useState } from "react";
import { toast } from "react-toastify";
import { createAQuestion } from "../../services/question.js";
import { useNavigate } from "react-router-dom";
import './CreateQuestion.css';

function CreateQuestion() {
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    question: "",
  });

  const handleCreateQuestion = async () => {
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
      const response = await createAQuestion(formData);
      toast.success(response.data.message || "Question created successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Failed to create question, please try again later"
      );
    }
  };

  return (
    <div className="create-container">
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title..."
        type="text"
        className="title-input"
      />

      <textarea
        value={formData.question}
        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
        placeholder="What's on your mind?"
        className="question-input"
      />

      <button onClick={handleCreateQuestion} className="ask-button">
        Ask
      </button>
    </div>
  );
}

export default CreateQuestion;