import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './App.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", { 
        username,
        password,
      });

      // Corrected key: 'access_token' instead of 'token'
      const token = response.data.access_token;
      
      localStorage.setItem("token", token);
      setShowSuccessMessage(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Registration error:", err);
      // Improved error handling
      setError(err.response?.data?.msg || "Registration failed. Check console for details.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Register</h2>

        {showSuccessMessage && (
          <div className="success-message-box">
            <p className="success">Registration successful! Redirecting to login...</p>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>

        {error && <p className="error">{error}</p>}

        <p>
          Already have an account?{" "}
          <button onClick={() => navigate("/login")}>Log In</button>
        </p>
      </div>
    </div>
  );
};

export default Register;