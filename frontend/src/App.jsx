//TODO: Remove component test path for prod

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import {ToastContainer} from 'react-toastify';
//PAGES
import ComponentTest from "./pages/ComponentTest.jsx"
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Homepage from "./pages/Homepage/Homepage.jsx";
import QuestionDetails from "./pages/QuestionDetails/QuestionDetails.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import CreateQuestion from "./pages/CreateQuestion/CreateQuestion.jsx";
import EditQuestionPage from "./pages/EditQuestionPage/EditQuestionPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
//PAGES

//COMPONENTS
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

//COMPONENTS

function RootLayout() {
  return (
    <>
      <Navbar/>
      <div className = "main">
        <Outlet />
      </div>
    
    </>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <PrivateRoute><Homepage /></PrivateRoute> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "question/:id", element: <PrivateRoute><QuestionDetails /></PrivateRoute> },
        { path: "user-profile", element: <PrivateRoute><UserProfile /></PrivateRoute>},
        { path: "create-question", element: <PrivateRoute><CreateQuestion /></PrivateRoute>},
        { path: "edit-question", element: <PrivateRoute><EditQuestionPage /></PrivateRoute>},
        { path: "test", element: <PrivateRoute><ComponentTest/></PrivateRoute>},
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return (<>
    <RouterProvider router={router} />
    <ToastContainer/>
    </>);
}

export default App;