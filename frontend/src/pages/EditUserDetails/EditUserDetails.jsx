import "./EditUserDetails.css";
import { editUserDetails } from "../../services/user.js";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { toast } from "react-toastify";

function EditUserDetails(){
  
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "")
  
  const handleEditUser = async () => {
    setLoading(true);
    
    //Authenticate fields
    if (!username.trim()){
      toast.error("Fill all fields");
      setLoading(false);
      return;
    }
    
    if (username.length > 15){
      toast.error("Username is too long");
      setLoading(false);
      return;
    }

    //Edit user
    try{
      await editUserDetails(userId, username);
      localStorage.setItem("username", username)
      toast.success("Details Updated");
      navigate("/user-profile");
    }
    catch(err){
      toast.error(err?.response?.data?.message || "Failed to update details");
      console.error(err?.response?.data?.message || "Failed to update details");
    }
    finally{
      setLoading(false);
    }
  }
  
  return (
    <div className = "edit-user-container">
      <h1>Edit User Details</h1>
      
      <div className = "edit-user-form">
        <label className = "edit-user-input-label">Username</label>
        <input
        type = "text"
        className = "edit-user-input"
        placeholder = "Edit Username"
        value = {username}
        onChange = {(e) => setUsername(e.target.value)}
        />
        
        <button
        className = "edit-user-button"
        onClick = {handleEditUser}
        disabled = {loading}
        >{loading ? "Updating..." : "Confirm"}</button>
      </div>
    </div>
    );
}

export default EditUserDetails