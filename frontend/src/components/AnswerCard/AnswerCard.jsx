import "./AnswerCard.css";
import { useState, useEffect, useRef } from "react";
import {editAnswer, deleteAnswer} from "../../services/answer.js"
import Swal from "sweetalert2"
import {toast} from "react-toastify";

function AnswerCard(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const timeAgo = (dateString) => {
  const isoString = dateString.replace(" ", "T") + "Z";
  const date = new Date(isoString);
  if (isNaN(date)) return "Invalid date";

  const now = Date.now();
  const diff = (now - date.getTime()) / 1000;

  if (diff < 0) return "in the future";
  if (diff < 60) return "just now";

  const pluralize = (num, word) => `${num} ${word}${num !== 1 ? 's' : ''} ago`;

  if (diff < 3600) return pluralize(Math.floor(diff / 60), 'minute');
  if (diff < 86400) return pluralize(Math.floor(diff / 3600), 'hour');
  if (diff < 604800) return pluralize(Math.floor(diff / 86400), 'day');

  return date.toLocaleDateString();
};

//Handle dropdown options
  const handleMenuClick = (action) => {
    //Edit answer
    if (action === "Edit"){
      const editAnAnswer = () => {
        Swal.fire({
          title: "Edit your answer",
          input: "textarea",
          inputValue: props.answer,
          inputPlaceholder: "Edit Answer...",
          showCancelButton: true,
          confirmButtonText: "Edit",
          confirmButtonColor: "#e30303",
          customClass: {input: "edit-answer-popup"}
        }).then(async (result) => {
          if (result.isConfirmed){
            //validate answer
            const editedAnswer = result.value;
            if (!editedAnswer.trim()){
              return;
            }
            if (editedAnswer.length > 2000){
              toast.error("Answer too long");
              return;
            }
            
            //update answer
            try{
              await editAnswer(props.questionId, props.id, {answer: editedAnswer});
              toast.success("Updated Successfully");
              window.location.reload();
            }
            catch(err){
              console.error(err);
            }
            
          }
        });
      }
      editAnAnswer();
    }
    
    //Delete answer 
    if (action === "Delete"){
      const deleteAnAnswer = () => {
        Swal.fire({
          title: "Delete Answer",
          text: "This action cannot be undone",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Delete",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#e30303",
          cancelButtonColor: "#d4cdcd",
        }).then(async (result) => {
          if (result.isConfirmed){
            try{
              await deleteAnswer(props.questionId, props.id);
              toast.success("Deleted Successfully");
              window.location.reload();
            }
            catch(err){
              console.error(err);
            }
          }
        });
      }
      deleteAnAnswer();
    }
    
    setIsMenuOpen(false);
  };
  
  const currentUser = parseInt(localStorage.getItem("userId"));

  return (
    <div className="answer-container">
      <div className="user-details">
        <img className="answer-image" src="/app.jpeg" />
        <p className="answer-username">{props.username}</p>
      </div>
      <p className="answer-date">{timeAgo(props.date)}</p>

      {/* Dropdown Menu */}
      <div className="menu-wrapper" ref={menuRef}>
        <div className="menu-dots" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {isMenuOpen && (
          <div className="dropdown-menu">
            {props.userId == currentUser ?
            <>
            <p onClick={() => handleMenuClick("Edit")}>Edit</p>
            <p onClick={() => handleMenuClick("Delete")}>Delete</p>
            </> :
            <></>
            }
          </div>
        )}
      </div>

      <div className="answer-box">
        <p className="answer-text">{props.answer}</p>
      </div>
    </div>
  );
}

export default AnswerCard;