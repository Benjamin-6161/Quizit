import {useState} from 'react';
import LoginFormButton from '../../components/Button/LoginFormButton';

import './Login.css';
import {useNavigate} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {login} from '../../services/auth.js';

function Login(){
  const navigate = useNavigate();
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
    try{
      const response = await login(formData);
      const token = response.data.token;
      const username = response.data.username;
      const email = response.data.email;
      const userId = response.data.id;
      if (!token){
        toast.error("Login failed");
        console.log("Login failed, token not received");
        return;
      }
      toast.success("Logged in");
      
      //Store jwt token
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userId)
      
      //redirect to homepage
      navigate("/")
      
    }
    catch(err){
      if (err.response){
        toast.error(err.response.data.message || "Login failed");
        console.error(err.response.data.message || err.response.statusText);
      }
      else{
        toast.error("Network error try again later");
      }
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
          
         <input 
          type = "password"
          value = {formData.password}
          placeholder = "Password"
          onChange = {(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        <LoginFormButton onClick = {handleLogin}/>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    );
}

export default Login;