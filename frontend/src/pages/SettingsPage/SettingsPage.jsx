import './SettingsPage.css';
import Swal from 'sweetalert2';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {deleteUserAccount} from '../../services/user.js';
import {logout} from "../../utils/authUtils.js";

function SettingsPage(){
  
  const currentUser = parseInt(localStorage.getItem("userId"));
  const navigate = useNavigate();
  
  const handleDeleteUser = () => {
    
    if(!currentUser){
      toast.error("Login first");
      return;
    }
    Swal.fire({
      title: "Delete Account",
      text: "This action can't be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete Account",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e30303",
      cancelButtonColor: "#d4cdcd",
    }).then(async (result) => {
      if (result.isConfirmed){
        try{
          const response = await deleteUserAccount(currentUser);
          toast.success("Account deleted successfully");
          localStorage.removeItem("userId");
          setInterval(() => {
            navigate("/login");
          }, 1000)
        }
        catch(err){
          console.error(err);
          toast.error(err.response?.data?.message || "Failed to delete account");
        }
      }
    });
  }
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    //navigate to homepage
    window.location.href = "/login"
  }
  
  
  return (
    <div className = "settings-container">
      <p className = "settings-option"
        onClick = {() => navigate("/edit-user")}
      >Edit profile</p>
      
      <p className = "settings-option"
        onClick = {handleLogout}
      >Logout</p>
      
      <p className = "settings-option delete"
        onClick = {handleDeleteUser}
      >Delete Account</p>
    </div>
    );
}

export default SettingsPage;