import React, { useState, useEffect , useRef } from "react";
import { toast } from "react-toastify";
import "./Navbar.css";
import {useNavigate} from "react-router-dom";
import PrivateRoute from '../PrivateRoute.jsx';


function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  
  //close navbar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleToProfile = () => {
    setOpen(false);
    navigate("/user-profile");
  }
  
  const handleToHomepage = () => {
    setOpen(false);
    navigate("/");
  }
  
  const handleToSettings = () => {
    setOpen(false);
    navigate("/settings");
  }

  return (
    <header className="navbar">
      <div className="navbar-header">Quizit</div>
      
      <PrivateRoute>
      <div className="menu" ref = {menuRef}>
        <div className="menu-icon" onClick={() => setOpen(!open)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`dropdown ${open ? "show" : ""}`}>
          <li onClick = {handleToHomepage}>Homepage</li>
          <li onClick = {handleToProfile}>Profile</li>
          <li onClick = {handleToSettings}>Settings</li>
        </ul>
      </div>
      </PrivateRoute>
    </header>
  );
}

export default Navbar;