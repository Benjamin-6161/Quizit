import './RegisterPages.css';

function RegisterPage1({ formData, setFormData }) {
  return (
    <div className="form-step">
      <h2>Personal Info</h2>
      <input
        required
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      />
      <input
        required
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />
    </div>
  );
}

export default RegisterPage1;