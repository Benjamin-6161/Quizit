import './Register.css'
import React, { useState } from "react";
import { toast } from "react-toastify";
import {Link, useNavigate} from 'react-router-dom';
import RegisterPage1 from "../../components/RegisterPages/RegisterPage1";
import RegisterPage2 from "../../components/RegisterPages/RegisterPage2";
import RegisterFormButton from '../../components/Button/RegisterFormButton'

import {register} from '../../services/auth.js';

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
  
  //Register user 
 const  registerUser = async () => {
    if(!authenticateForm()){
      toast.error("Fill all fields to register");
      return;
    }
    
    if(formData.firstName.trim().length > 20 ||
       formData.lastName.trim().length > 20 ||
       formData.username.trim().length > 15 ||
       formData.email.trim().length > 40 ||
       formData.password.trim().length > 200){
      toast.error("One or more User Details are too long");
      return;
    }
    
    if (!emailPattern.test(formData.email)){
      toast.error("Invalid Email");
      return;
    }
    if (!passwordRegex.test(formData.password)){
      toast.error("Password must include at least 8 characters, An uppercase, a lowercase and a digit");
      return;
    }
    try{
      const response = await register(formData);
      toast.success(response.data.message || "Registered Successfully");
      navigate("/login")
    }
    catch(err){
      if (err.response.status === 409){
      toast.error(err.response.data.message || "Email already exists");
      }
      else{
        toast.error(err.response.data.message || "Something went wrong")
        alert(err.response.data.message || "Something went wrong")
      }
    }
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      {step === 1 && <RegisterPage1 formData={formData} setFormData={setFormData} />}
      {step === 2 &&
        <RegisterPage2 formData={formData} setFormData={setFormData} onClick = {registerUser}/>}
      <p>Already have an account? <Link to={'/login'}>Login</Link></p>
      <div className="navigation-buttons">
        {step > 1 && <button onClick={prevStep}>Back</button>}
        {step < 2 && <button onClick={nextStep}>Next</button>}
      </div>
    </div>
  );
}

export default Register;