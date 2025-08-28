import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import LandManagement from "./LandManagement";
import LandDetails from "./LandDetails";
import Home from "./Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const ProtectedRoute = ({ authToken, children }) => {
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Wrapper component to use navigate outside Router
const AppWrapper = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("jwt_token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authToken && location.pathname === "/login") {
      navigate("/LandManagement");
    }
  }, [authToken, location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginRegister setAuthToken={setAuthToken} />} />
      <Route
        path="/LandManagement"
        element={
          <ProtectedRoute authToken={authToken}>
            <LandManagement onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/land-details"
        element={
          <ProtectedRoute authToken={authToken}>
            <LandDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
