import './QuestionDetailCard.css';
import Swal from 'sweetalert2';
import React, { useState, useRef, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleFavoriteQuestion, handleRemoveQuestionFromFavorites } from '../../utils/questionUtils.js';
import { Heart } from 'lucide-react';
import { deleteAQuestion } from '../../services/question.js';

function QuestionDetailCard(props) {
  const favoriteQuestionIds = JSON.parse(localStorage.getItem("favoriteQuestionIds")) || [];
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(favoriteQuestionIds.includes(props.id));
  const menuRef = useRef(null);
  const currentUserId = parseInt(localStorage.getItem("userId"));

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  useEffect(() => {favoriteQuestionIds.includes(props.id)}, [])

  function handleToEditQuestion() {
    localStorage.setItem("questionId", props.id);
    localStorage.setItem("title", props.title);
    localStorage.setItem("question", props.question);
    navigate("/edit-question");
  }

  const handleDeleteQuestion = async () => {
    Swal.fire({
      title: "Confirm Delete",
      text: "This action can't be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e30303",
      cancelButtonColor: "#d4cdcd",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAQuestion(props.id);
          toast.success("Question deleted successfully");
          navigate("/");
        } catch (err) {
          console.error(err);
          Swal.fire("Failed to delete question");
        }
      }
    });
  };

  const timeAgo = (dateString) => {
    const isoString = dateString + "Z";
    const date = new Date(isoString);
    if (isNaN(date)) return "Invalid date";

    const now = Date.now();
    const diff = (now - date.getTime()) / 1000;

    if (diff < 60) return "just now";

    const pluralize = (num, word) => `${num} ${word}${num !== 1 ? 's' : ''} ago`;

    if (diff < 3600) return pluralize(Math.floor(diff / 60), 'minute');
    if (diff < 86400) return pluralize(Math.floor(diff / 3600), 'hour');
    if (diff < 604800) return pluralize(Math.floor(diff / 86400), 'day');

    return date.toLocaleDateString();
  };

  return (
    <div className="question-detail-container">
      <div className="question-detail-user-details">
        <img className="question-detail-user-img" src="/app.jpeg" alt="profile" />
        <p className="question-detail-username">{props.username}</p>
      </div>
      <p className="question-detail-date">{timeAgo(props.date)}</p>

      {/* Menu dots */}
      <div className="menu-wrapper" ref={menuRef}>
        <div className="menu-dots" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {isMenuOpen && <div className="dropdown-menu"></div>}
      </div>

      <p className="question-detail-title">{props.title}</p>
      <div className="question-detail-box">
        <p className="question-detail-question">{props.question}</p>
      </div>

      {props.userId === currentUserId ? (
        <div className="question-detail-options-container">
          <p className="question-detail-edit" onClick={handleToEditQuestion}>
            Edit Question
          </p>
          <p className="question-detail-delete" onClick={handleDeleteQuestion}>
            Delete Question
          </p>
        </div>
      ) : (
        <div></div>
      )}

      <div className="question-detail-option-buttons">
        {!isFavorite ? (
          <button
            className="remove-favorite"
            onClick={() => {
              handleFavoriteQuestion(props.id, currentUserId).then((success) => {
                if (success) {
                  setIsFavorite(true);
                  toast.success("Added to Favorites");
                }
              });
            }}
          >
            <Heart size={20} color="grey" />
          </button>
        ) : (
          <button
            className="favorite"
            onClick={() => {
              handleRemoveQuestionFromFavorites(props.id, currentUserId).then(() => {
                setIsFavorite(false);
                toast.success("Removed from favorites");
              });
            }}
          >
            <Heart size={20} color="red" />
          </button>
        )}
      </div>
    </div>
  );
}

export default QuestionDetailCard;