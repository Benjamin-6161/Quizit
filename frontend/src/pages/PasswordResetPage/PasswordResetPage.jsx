import React, {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {Eye, EyeOff} from 'lucide-react';
import {requestOtp} from '../../services/auth.js';
import './PasswordResetPage.css';
import { useNavigate } from "react-router-dom";

function PasswordResetPage(){
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  
  const handlePasswordReset = async() => {
    setLoading(true);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    //validate fields
    if(!email.trim() || !password.trim()){
      toast.error("Fill all fields to continue");
      setLoading(false);
      return;
    }
    
    if(email.trim().length > 50 || password.trim().length > 200){
      toast.error("One or more fields are too long");
      setLoading(false);
      return;
    }
    
    //validate email
    if(!emailPattern.test(email)){
      toast.error("Invalid email");
      setLoading(false);
      return;
    }
    
    //validate password
    if(!passwordRegex.test(password)){
      toast.error("Password must include at least 8 characters, An uppercase, a lowercase and a digit");
      setLoading(false);
      return;
    }
    
    //request otp
    try{
      await requestOtp(email, "reset-password");
      localStorage.setItem("purpose", "reset-password");
      
      navigate("/verify-otp", { state: {newPassword: password, email } });
    }
    catch(err){
      toast.error(err?.response?.data?.message || "Failed");
      console.error(err?.response?.data?.message || "Failed");
    }
    finally{
      setLoading(false);
    }
  }
  
  return(
    <div className = "password-reset-container">
      <h1 className = "password-reset-header">Password Reset</h1>
      <div className = "password-reset-form">
        
        <input
        className = "password-reset-input"
        value = {email}
        type = "email"
        placeholder = "Email"
        onChange = {(e) => setEmail(e.target.value)}
        />
        
        <div className = "pw-div">
        <input
        type = {showPassword ? "text": "password"}
        className = "password-reset-input"
        value = {password}
        placeholder = "New Password"
        onChange = {(e) => setPassword(e.target.value)}
        />
        <button
          className="show-pw-btn"
          type = "button"
          onClick = {() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
        </button>
        </div>
        
        <button
        className = "form-button"
        onClick = {handlePasswordReset}
        disabled = {loading}
        >{loading ? "Verifying..." : "Reset Password"}</button>
      </div>
    </div>
    );
}

export default PasswordResetPage;