import React, {useState, useEffect} from 'react';
import {Eye, EyeOff} from 'lucide-react';

import GoogleButton from "../../components/GoogleButton.jsx";
import './Login.css';
import {useNavigate, Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {login} from '../../services/auth.js';

function Login(){
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  //Validate Form 
  function validateForm(){
    if (!formData.email.trim() || !formData.password.trim()){
      return false;
    }
    return true;
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  
  //Login User
  const handleLogin = async () => {
    if (!emailPattern.test(formData.email)){
      toast.error("Invalid Email");
      return;
    }
    if (validateForm()){
      setLoading(true);
    try{
      const response = await login(formData);
      const token = response.data.token;
      const username = response.data.details.username;
      const email = response.data.details.email;
      const userId = response.data.details.id;
      const favoriteQuestions = JSON.stringify(response.data.details.favoriteQuestions);
      
      if (!token){
        toast.error("Login failed");
        console.error("Login failed, token not received");
        return;
      }
      //Store jwt token
      localStorage.setItem("token", token);
      localStorage.setItem("authenticated", true)
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userId);
      localStorage.setItem("favoriteQuestions", favoriteQuestions);
      
      toast.success("Logged in");
      //redirect to homepage
      navigate("/");
      
    }
    catch(err){
      if (err.response){
        toast.error(err.response.data.message || "Login failed");
        console.error(err.response.data.message || err.response.statusText);
      }
      else{
        toast.error("Network error try again later");
      }
      setLoading(false);
    }
    }
    else{
      toast.error("Fill all fields to login")
    }
  }
  
  return(
      <div className= "login-form">
        <h1 >Login</h1>
        <div className= "login-container">
          <input 
          type = "email"
          value = {formData.email}
          placeholder = "Email"
          onChange = {(e) => setFormData({...formData, email: e.target.value})}
          />
          
         <div className="pw-div">
         <input 
          type = {showPassword ? "text" : "password"}
          value = {formData.password}
          placeholder = "Password"
          onChange = {(e) => setFormData({...formData, password: e.target.value})}
          />
          <button
          className="show-pw-btn"
          type = "button"
          onClick = {() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
          </div>
          <button
            type =  "button"
            className = "form-button"
            onClick = {() => {handleLogin()}}
            disabled = {loading}
          >{loading ? "Logging in..." : "Login"}</button>
        </div>
        <p><Link to="/password-reset">Forgot password? </Link></p>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
        <GoogleButton/>
      </div>
    );
}

export default Login;