import './FavoritesPage.css';
import React, {useState, useEffect} from "react";
import {getUserDetails} from "../../services/user.js";
import {toast} from "react-toastify"
import QuestionCard from '../../components/QuestionCard/QuestionCard.jsx';

function FavoritesPage(){
  const currentUserId = parseInt(localStorage.getItem("userId"));
  const [userFavorites, setUserFavorites] = useState([]);
  
  useEffect(() => {
    const getUserFavorites = async () => {
      try{
        const response = await getUserDetails(currentUserId);
        setUserFavorites(response.data.details.favoriteQuestions.reverse());
      }
      catch(err){
        console.error(err.response.data.message);
        toast.error(err.response.data.message);
      }
    }
    getUserFavorites();
  }, []);
  
  return (
    <div>
      <h1>Favorites</h1>
      {
        userFavorites.map((q) =>
          <QuestionCard
          key = {q.id}
          id = {q.id}
          username = {q.username}
          date = {q.createdAt}
          title = {q.title}
          question = {q.question}
          />
        )
      }
    </div>
    );
}

export default FavoritesPage;