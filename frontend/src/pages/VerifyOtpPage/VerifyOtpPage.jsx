import { useNavigate, useLocation } from "react-router-dom";
import "./VerifyOtpPage.css";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { requestOtp, verifyOtp, register, resetPassword } from "../../services/auth.js";

function VerifyOtpPage() {
  const navigate = useNavigate();
  const {state} = useLocation();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const isRegister = localStorage.getItem("purpose") === "register";
  const isResetPassword = localStorage.getItem("purpose") === "reset-password";
  //Details for user registration
  const userRegisterDetails = {
    firstName: state?.regFirstName,
    lastName: state?.regLastName,
    username: state?.regUsername,
    email: state?.regEmail,
    password: state?.regPassword,
  };
  
  //Details for user password reset
  const userPasswordResetDetails = {
    email: state?.email,
    password: state?.newPassword,
  };
  
  //otp email
  const otpEmail = isRegister ? userRegisterDetails.email : userPasswordResetDetails.email;
  

  //Go back if user refreshes
  useEffect(() => {
  if (isResetPassword && (!state?.email || !state?.newPassword)) {
    toast.error("Session expired");
    navigate("/login");
  }
}, []);

  useEffect(() => {
  if (isRegister && (!state?.regFirstName  || !state?.regLastName  || !state?.regUsername  || !state?.regEmail  || !state?.regPassword)) {
    toast.error("Session expired");
    navigate("/register");
  }
}, []);
  
  // Countdown timer effect
  useEffect(() => {
    setTimer(60);
  },[]);
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const processUser = async () => {
    if (otp.trim().length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      await verifyOtp(otpEmail, otp) 

      // OTP correct, register user
      if (isRegister) {
        try{
          const response = await register(userRegisterDetails);
          toast.success(response.data.message || "Registered Successfully");

          localStorage.removeItem("purpose");
        
          navigate("/login");
        }
        catch (err) {
        if (err && err.response.status === 409){
          console.error("This email is already registered");
          navigate("/register");
        }
          const msg = err?.response?.data?.message || "Something went wrong";
          toast.error(msg);
          console.error(msg);
        }
      }
      
      //OTP correct, reset user password
      else if (isResetPassword){
        try{
          await resetPassword(userPasswordResetDetails.email, userPasswordResetDetails.password);
          
          toast.success("Password Reset Successfully");
          
          navigate("/login");
        }
        catch(err){
          toast.error(err?.response?.data?.message || "Failed");
          console.error(err?.response?.data?.message || "Failed");
        }
      }
    }
    catch(err){
      toast.error(err?.response?.data?.message)
      console.error(err?.response?.data?.message)
    }
    finally{
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setResending(true);

    try {
      await requestOtp(otpEmail, localStorage.getItem("purpose"));
      toast.success("OTP resent");

      setTimer(60);
    } catch (err) {
      const msg = err?.response?.data?.message || "Error sending OTP";
      toast.error(msg);
      console.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className = "verify-otp-container">
      <h1 className = "verify-otp-header1">Verify OTP</h1>
      <h3 className = "verify-otp-header3">A 6-digit OTP has been sent to {otpEmail}</h3>

      <input
        className = "verify-otp-input"
        value={otp}
        type = "text"
        inputMode = "numeric"
        pattern = "[0-9]*"
        maxLength = {6}
        onChange = {(e) => setOtp(e.target.value)}
        placeholder = "6-digit OTP"
      />

      <button 
        className = "verify-otp-button"
        disabled={loading} onClick={processUser}>
        {loading ? "Verifying..." : "Verify"}
      </button>

      <button
        className = "verify-otp-button"
        disabled={timer > 0 || resending}
        onClick={resendOtp}
      >
        {timer > 0 ? `Resend in ${timer}s` : resending ? "Resending..." : "Resend OTP"}
      </button>
    </div>
  );
}

export default VerifyOtpPage;