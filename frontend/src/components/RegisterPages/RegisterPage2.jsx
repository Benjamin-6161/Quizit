import './RegisterPages.css';
import RegisterFormButton from '../Button/RegisterFormButton'

function RegisterPage2({ formData, setFormData, onClick }) {
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
      
      <input
        required
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <RegisterFormButton onClick = {onClick}/>
    </div>
  );
}

export default RegisterPage2;