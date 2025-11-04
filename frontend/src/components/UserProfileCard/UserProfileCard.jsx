import React from "react";
import "./UserProfileCard.css";

function UserProfileCard(props){
  
  const username = localStorage.getItem("username");
  
  return (
    <div className="user-card">
      <img
        src="/app.jpeg"
        alt="User profile"
        className="user-avatar"
      />
      <h3 className="user-name">{username}</h3>
      <div className = "rank-div">
        <img src = {props.level.img} className = "rank-image" />
        <p className = "rank">{props.level.rank}</p>
        <p className = "remark">{props.level.remark}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;