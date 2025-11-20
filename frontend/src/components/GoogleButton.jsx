import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {authenticateWithGoogle} from "../services/auth.js"

function GoogleButton() {
  
  const navigate = useNavigate();
  
  useEffect(() => {
  if (!window.google) return; 

  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleGoogleCallback,
  });

  window.google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    { theme: "outline", size: "large" }
  );
}, []);

  const handleGoogleCallback = async (response) => {
    try {
      const backendRes = await authenticateWithGoogle(response);
      
      const username = backendRes.data.details.username;
      const email = backendRes.data.details.email;
      const userId = backendRes.data.details.id;
      const favoriteQuestions = JSON.stringify(backendRes.data.details.favoriteQuestions);

      localStorage.setItem("token", backendRes.data.token);
      localStorage.setItem("authenticated", true);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userId);
      localStorage.setItem("favoriteQuestions", favoriteQuestions);

      toast.success("Logged in with Google!");
      // to homepage
      navigate("/")
    } catch (err) {
      console.error(err?.response?.data?.message || "Google login failed");
      toast.error(err?.response?.data?.message || "Google login failed");
    }
  };

  return <div id="googleBtn"></div>;
}

export default GoogleButton;