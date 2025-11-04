import {Link} from 'react-router-dom';
import './NotFoundPage.css';

function NotFoundPage(){
  
  return(
    <div>
      <h1 className = "not-found-header">URL NOT FOUND</h1>
      
      <div className = "not-found-body">
      <img
      className = "not-found-image"
      src = "/logo.png"
      alt = "Quizit Logo"
      />
      <p className = "not-found-text">The url you entered was not found!</p>
      <Link to = "/"><p className = "to-homepage">Back To Homepage</p></Link>
      </div>
    </div>
    );
}

export default NotFoundPage;