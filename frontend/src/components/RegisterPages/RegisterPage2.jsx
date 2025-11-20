import './RegisterPages.css';
import {useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';
import RegisterFormButton from '../Button/RegisterFormButton'

function RegisterPage2({ formData, setFormData, register, loading }) {
  
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="form-step">
      <h2>Account Info</h2>
      <input
        required
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      
      <input
        required
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      
      <div className="pw-div">
      <input
        required
        type = {showPassword ? "text" : "password"}
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button 
      className="show-pw-btn"
      type = "button"
      onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
      </button>
      </div>
      <RegisterFormButton 
      onClick = {register}
      loading = {loading}/>
    </div>
  );
}

export default RegisterPage2;