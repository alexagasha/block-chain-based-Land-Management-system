import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import logo from "./photos/blockchain.jpeg";

const LoginRegister = ({ setAuthToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      setAuthToken(token);
      navigate("/LandManagement");
    }
  }, [navigate, setAuthToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering && password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    // ✅ Use fallback if REACT_APP_API_URL is not set
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await axios.post(url, { username, password }, {
        headers: { "Content-Type": "application/json" },
      });

      if (isRegistering) {
        setMessage("✅ Registration successful! Please log in.");
        setIsRegistering(false);
        setConfirmPassword("");
        setPassword("");
        setUsername("");
      } else {
        const { token } = response.data;
        localStorage.setItem("jwt_token", token);
        setAuthToken(token);
        navigate("/LandManagement");
      }
    } catch (error) {
      console.error("Login/Register Error:", error); // ✅ helpful during testing
      const errorMessage =
        error.response?.data?.message || "❌ Something went wrong. Try again.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center mb-4">
        <img src={logo} alt="Logo" style={{ height: 60 }} />
        <h2 className="mt-2">
          {isRegistering ? "Register" : "Login"} to Land Management System
        </h2>
      </div>

      <div className="card p-4 shadow" style={{ minWidth: 350 }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegistering ? "new-password" : "current-password"}
            />
          </div>

          {isRegistering && (
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            {isRegistering ? "Register" : "Login"}
          </button>

          {message && (
            <div className="alert alert-danger mt-3 text-center" role="alert">
              {message}
            </div>
          )}
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => {
              setMessage("");
              setIsRegistering(!isRegistering);
            }}
          >
            {isRegistering
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
