import {getAllQuestions} from '../../services/question.js';
import QuestionCard from '../../components/QuestionCard/QuestionCard.jsx'
import {useState, useEffect} from 'react';
import './Homepage.css';
import {useNavigate} from 'react-router-dom';

function Homepage(){
  
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAllQuestions = async () => {
      const response = await getAllQuestions();
      setQuestions(response.data.reverse());
      setLoading(false);
    }
    fetchAllQuestions();
  }, []);
  
  if (loading){
    return (
    <div>
      <p className = "load-text">Getting all inquiries...</p>
    </div>);
  }
  
  return(
    <div>
      <div className = "options">
        <p onClick = {() => navigate("/create-question")} className = "create">Ask a Question</p>
      </div>
      {questions.map((q) => 
      <QuestionCard
      key = {q.id}
      id = {q.id}
      username = {q.username}
      date = {q.createdAt}
      title = {q.title}
      question = {q.question}
      />
      )}
    </div>
    );
}

export default Homepage;