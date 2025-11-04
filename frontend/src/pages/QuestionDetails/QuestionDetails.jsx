import { useParams, useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import {getAQuestion} from  "../../services/question.js";
import {addAnswer} from  "../../services/answer.js";
import React, {useEffect, useState} from "react";
import AnswerCard from '../../components/AnswerCard/AnswerCard.jsx';
import QuestionDetailCard from '../../components/QuestionDetailCard/QuestionDetailCard.jsx';
import "./QuestionDetails.css";

function QuestionDetails(){
  const navigate = useNavigate();
  const {id} = useParams();
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState({answer: "",});
  
  useEffect(() => {getQuestion();
  },[]);
  
  const getQuestion = async() => {
      try{
      const response = await getAQuestion(id);
      const questionObj = response.data.question;
      setAnswers(questionObj.answers.reverse());
      setQuestion(questionObj);
      }
      catch(err){
        console.error(err);
        navigate("/");
      }
    }
    
  const handleAddAnswer = async() => {
    //validate answer
    if (!answer.answer.trim()){
      return;
    }
    if (answer.answer.length > 2000){
      toast.error("Answer is too long");
      return;
    }
    try{
      await addAnswer(question.id, answer);
      setAnswer({answer: ""});
      window.location.reload();
    }
    catch(err){
      toast.error(err || "Failed to submit answer, try again later");
      console.error(error);
    }
  }
  

  
  return(
    <div>
      <QuestionDetailCard
      userId = {question.userId}
      id = {question.id}
      username = {question.username}
      date = {question.createdAt}
      title = {question.title}
      question = {question.question}
      />
      <div className = "answers">
        <h2 className = "answers-heading">Answers</h2>
        {answers.length > 0 ? 
        answers.map((a) => <AnswerCard
        key = {a.id}
        id = {a.id}
        questionId = {a.questionId}
        userId = {a.userId}
        username = {a.username}
        date = {a.updatedAt}
        answer = {a.answer}
        setAnswer = {setAnswer}
         />) : <p className = "no-answers">No Answers Yet...</p>}
      </div>
      <div className = "add-answer">
        <input
        className = "answer-input"
        value = {answer.answer}
        onChange = {(e) => setAnswer({answer: e.target.value})}
        placeholder = "What do you have to say?"
        />
        <button 
        className = "answer-button"
        onClick = {handleAddAnswer}
        >Answer</button>
      </div>
   </div>
    );
}

export default QuestionDetails;