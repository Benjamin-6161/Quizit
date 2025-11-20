import React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const isAutheticated = localStorage.getItem("authenticated");

  if (token && isAutheticated === "true") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;