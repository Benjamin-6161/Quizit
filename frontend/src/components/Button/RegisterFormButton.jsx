import './Buttons.css';

function RegisterFormButton(props){
  return (
    <button
    type = "button"
    className = "form-button"
    onClick = {props.onClick}
    >Register</button>
    );
}

export default RegisterFormButton;