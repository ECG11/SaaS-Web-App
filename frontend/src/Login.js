import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './App.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("username", response.data.username);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials, please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Log In</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="register-link">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")}>Register</button>
        </p>
      </div>
    </div>
  );
};

export default Login;