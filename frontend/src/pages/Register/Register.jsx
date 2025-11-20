import './Register.css'
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {Link, useNavigate} from 'react-router-dom';
import RegisterPage1 from "../../components/RegisterPages/RegisterPage1";
import RegisterPage2 from "../../components/RegisterPages/RegisterPage2";
import RegisterFormButton from '../../components/Button/RegisterFormButton'
import GoogleButton from "../../components/GoogleButton.jsx";

import {requestOtp} from '../../services/auth.js';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  });

//Registration pages
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  //Authenticate form data 
  function authenticateForm(){
    if (!formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.username.trim() ||
        !formData.email.trim() ||
        !formData.password.trim()){
      return false;
    }
    return true;
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  
  //Request Otp
 const  requestUserOtp = async () => {
    setLoading(true);
    if(!authenticateForm()){
      toast.error("Fill all fields to register");
      setLoading(false);
      return;
    }
    
    if(formData.firstName.trim().length > 20 ||
       formData.lastName.trim().length > 20 ||
       formData.username.trim().length > 15 ||
       formData.email.trim().length > 50 ||
       formData.password.trim().length > 200){
      toast.error("One or more User Details are too long");
      setLoading(false);
      return;
    }
    
    if (!emailPattern.test(formData.email)){
      toast.error("Invalid Email");
      setLoading(false);
      return;
    }
    if (!passwordRegex.test(formData.password)){
      toast.error("Password must include at least 8 characters, An uppercase, a lowercase and a digit");
      setLoading(false);
      return;
    }
    //request otp
    try{
      await requestOtp(formData.email, "registration");
      
      localStorage.setItem("purpose", "register");
      navigate("/verify-otp", { 
        state: { 
          regFirstName: formData.firstName, 
          regLastName: formData.lastName, 
          regUsername: formData.username, 
          regEmail: formData.email, 
          regPassword: formData.password 
        } 
        });
    }
    catch(err){
      toast.error(err?.response?.data?.message || "Failed");
      console.error(err?.response?.data?.message || "Failed");
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      
      {step === 1 && 
      <RegisterPage1
      formData={formData} 
      setFormData={setFormData} />}
      
      {step === 2 &&
        <RegisterPage2 
        formData={formData} 
        setFormData={setFormData}
        register = {requestUserOtp}
        loading = {loading}/>}
        
      <p>Already have an account? <Link to={'/login'}>Login</Link></p>
      <GoogleButton/>
      <div className="navigation-buttons">
        {step > 1 && <button onClick={prevStep}>Back</button>}
        {step < 2 && <button onClick={nextStep}>Next</button>}
      </div>
    </div>
  );
}

export default Register;