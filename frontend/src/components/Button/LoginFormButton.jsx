import './Buttons.css';

function LoginFormButton(props){
  return (
    <button
    type =  "button"
    className = "form-button"
    onClick = {props.onClick}
    >Login</button>
    );
}

export default LoginFormButton;