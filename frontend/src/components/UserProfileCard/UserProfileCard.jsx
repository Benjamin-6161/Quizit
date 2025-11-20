import React, {useRef, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "./UserProfileCard.css";

function UserProfileCard(props){
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const username = localStorage.getItem("username");
  
  //close dropdown menu 
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
  
  const handleToFavoritesPage = () => {
    setIsMenuOpen(false);
    navigate("/user-favorites");
  }
  
  const handleToEditProfilePage = () => {
    setIsMenuOpen(false);
    navigate("/edit-user");
  }
  
  return (
    <div className="user-card">
      <img
        src="/app.jpeg"
        alt="User profile"
        className="user-avatar"
      />
      <h3 className="user-name">{username}</h3>
      {/* Dropdown Menu */}
      <div className="profile-menu-wrapper" ref={menuRef}>
        <div className="profile-menu-dots" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {isMenuOpen && (
          <div className="profile-dropdown-menu">
            <p onClick = {handleToFavoritesPage}>Favorites</p>
            <p onClick = {handleToEditProfilePage}>Edit Profile</p>
          </div>
        )}
      </div>
      <div className = "rank-div">
        <img src = {props.level.img} className = "rank-image" />
        <p className = "rank">{props.level.rank}</p>
        <p className = "remark">{props.level.remark}</p>
      </div>
    </div>
  );
};

export default UserProfileCard;