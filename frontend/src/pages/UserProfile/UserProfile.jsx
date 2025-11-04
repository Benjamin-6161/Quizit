import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import UserProfileCard from '../../components/UserProfileCard/UserProfileCard.jsx'
import QuestionCard from '../../components/QuestionCard/QuestionCard.jsx';
import './UserProfile.css'
import {getUserQuestions} from '../../services/question.js';

function UserProfile(){
  
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  //GET USER QUESTIONS
  useEffect(() => {
    const getAllUserQuestions = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    const response = await getUserQuestions(parseInt(userId));
      setQuestions(response.data.reverse());
      setLoading(false);
    }
    getAllUserQuestions();
  }, []);
  
  //RANKS
  const checkRank = (num) => {
    let level = {rank: "None", remark: "None", img: "/black.jpg"}
    switch(true){
      case(num <= 2):
        level.rank = "Silent Thinker";
        level.remark = "Still warming up those neurons huh?";
        level.img = "/images/silent-thinker.png";
        break;
        
        case(num <= 6):
        level.rank = "The Philosopher's Apprentice";
        level.remark = "It all starts with a thought!";
        level.img = "/images/philosopher's-apprentice.png";
        break;
        
        case(num <= 10):
        level.rank = "Curious George";
        level.remark = "You're quite inquisitive aren't you!?";
        level.img = "/images/curious-george.png";
        break;
        
        case(num <= 20):
        level.rank = "Professor Why?";
        level.remark = "You've clearly got a lot on your mind!";
        level.img = "/images/professor-why.png";
        break;
        
        case(num <= 30):
        level.rank = "Plato?";
        level.remark = "Deep thoughts incoming...";
        level.img = "/images/plato.png";
        break;
        
        case(num <= 50):
        level.rank = "Trivia Titan";
        level.remark = "No question is too big or small for you!";
        level.img = "/images/trivia-titan.png";
        break;
        
        case(num <= 100):
        level.rank = "Question Overlord";
        level.remark = "There's A LOT keeping you up at night!";
        level.img = "/images/question-overlord.png";
        break;
        
        default:
        level.rank = "GOD!";
        level.remark = "Surely, you've gained omniscience by now!";
        level.img = "/images/god.png";
    }
    return level;
  }
  
  
  return(
    <div>
      <UserProfileCard level = {loading ? {rank: "...", remark: "...", img: "/black.jpg"}: checkRank(questions.length)}/>
      <div className = "user-questions">
        <h2>Your Curiosities ?</h2>
        <div>
          <p onClick = {() => navigate("/create-question")} className = "create">Ask a Question</p>
        </div>
        {loading? <p className = "no-questions">Loading your Curiosities...</p> :
        questions.length > 0 ? questions.map((question) =>
          <QuestionCard 
          key = {question.id}
          id = {question.id}
          username = {question.username}
          title = {question.title}
          question = {question.question}
          date = {question.createdAt}
          />
        ): <p className  = "no-questions">You haven't asked any questions yet!</p>}
      </div>
    </div>
    );
}

export default UserProfile;