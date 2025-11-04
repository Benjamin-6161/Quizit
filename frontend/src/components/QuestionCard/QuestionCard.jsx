import './QuestionCard.css';
import {useNavigate} from 'react-router-dom';

function QuestionCard(props){
  
  const navigate = useNavigate();
  
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
    </div>
    );
}

export default QuestionCard;