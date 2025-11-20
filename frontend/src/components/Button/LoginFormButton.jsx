import './Buttons.css';

function LoginFormButton(props){
  return (
    <button
    type =  "button"
    className = "form-button"
    disabled = {props.status}
    onClick = {props.onClick}
    >Login</button>
    );
}

export default LoginFormButton;