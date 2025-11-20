//TODO: Remove component test path for prod

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import {ToastContainer} from 'react-toastify';
//PAGES
import ComponentTest from "./pages/ComponentTest.jsx"
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage.jsx"
import SettingsPage from "./pages/SettingsPage/SettingsPage.jsx"
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import PasswordResetPage from "./pages/PasswordResetPage/PasswordResetPage.jsx";
import VerifyOtpPage from "./pages/VerifyOtpPage/VerifyOtpPage.jsx";
import Homepage from "./pages/Homepage/Homepage.jsx";
import QuestionDetails from "./pages/QuestionDetails/QuestionDetails.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import CreateQuestion from "./pages/CreateQuestion/CreateQuestion.jsx";
import EditQuestionPage from "./pages/EditQuestionPage/EditQuestionPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import EditUserDetails from "./pages/EditUserDetails/EditUserDetails.jsx";
//PAGES

//COMPONENTS
import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
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
        { path: "login", element: <PublicRoute><Login /></PublicRoute> },
        { path: "register", element: <PublicRoute><Register /></PublicRoute> },
        { path: "verify-otp", element: <PublicRoute><VerifyOtpPage/></PublicRoute> },
        { path: "password-reset", element: <PublicRoute><PasswordResetPage/></PublicRoute> },
        { path: "question/:id", element: <PrivateRoute><QuestionDetails /></PrivateRoute> },
        { path: "user-profile", element: <PrivateRoute><UserProfile /></PrivateRoute>},
        { path: "user-favorites", element: <PrivateRoute><FavoritesPage /></PrivateRoute>},
        { path: "create-question", element: <PrivateRoute><CreateQuestion /></PrivateRoute>},
        { path: "edit-question", element: <PrivateRoute><EditQuestionPage /></PrivateRoute>},
        { path: "edit-user", element: <PrivateRoute><EditUserDetails /></PrivateRoute>},
        { path: "settings", element: <PrivateRoute><SettingsPage/></PrivateRoute>},
        { path: "test", element: <ComponentTest/>},
        { path: "*", element: <NotFoundPage /> },
      ],
    },
  ]);

  return (<>
    <RouterProvider router={router} />
    <ToastContainer hideProgressBar={true} autoClose={1000}/>
    </>);
}

export default App;