import './Buttons.css';

function RegisterFormButton(props){
  return (
    <button
    type = "button"
    className = "form-button"
    onClick = {props.onClick}
    disabled = {props.loading}
    >{props.loading ? "Register" : "Verifying..."}</button>
    );
}

export default RegisterFormButton;