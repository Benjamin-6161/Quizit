import './QuestionCard.css';
import {Heart, HeartOff} from 'lucide-react';
import React, {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import {handleFavoriteQuestion, handleRemoveQuestionFromFavorites} from '../../utils/questionUtils.js';

function QuestionCard(props){

  const navigate = useNavigate();
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const favoriteQuestionIds = JSON.parse(localStorage.getItem("favoriteQuestionIds")) || [];
  const [isFavorite, setIsFavorite] = useState(favoriteQuestionIds.includes(props.id));
  

  const handleToQuestionDetail = () => {
    navigate(`/question/${props.id}`)
  }

  const timeAgo = (dateString) => {
  const isoString = dateString.replace(" ", "T") + "Z";
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

  return(
    <div className = "question-container">
      <div className = "user-details">
      <img className = "user-img" src = "/app.jpeg" alt = "profile"/>
        <p className = "username">{props.username}</p>
      </div>
      <p className = "date">{timeAgo(props.date)}</p>
      <p className = "title">{props.title.length < 40 ? props.title : `${props.title.substring(0, 40)}...`}</p>
      <div className = "question-box">
        <p className = "question">{props.question.length <= 200 ? props.question : `${props.question.substring(0, 200)}...`}</p>
      </div>
      <p onClick = {handleToQuestionDetail} className = "details">Details</p>

      <div className = "question-detail-option-buttons">
        {!isFavorite ?
        <button className = "remove-favorite"
         onClick = {() => { handleFavoriteQuestion(props.id, currentUserId).then(success => {
           if (success) {
             setIsFavorite(true);
             toast.success("Added to Favorites")
           }
         });
         }}
         ><Heart size={20} color="grey"/></button> :

        <button className = "favorite"
        onClick={() => {
          handleRemoveQuestionFromFavorites(props.id, currentUserId).then(() => {
            setIsFavorite(false);
            toast.success("Removed from favorites");
            });
        }}
        ><Heart size={20} color="red"/></button>
        }
      </div>
    </div>
    );
}

export default QuestionCard;