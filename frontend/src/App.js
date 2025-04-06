import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Chatbox from './Chatbox';  // Import the Chatbox component

function App() {
  // Retrieve the username from localStorage
  const username = localStorage.getItem('username') || 'Guest'; // Fallback to 'Guest' if no username exists

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route to login page */}
          <Route path="/" element={<Login />} />
          {/* Route for login */}
          <Route path="/login" element={<Login />} />
          {/* Route for register */}
          <Route path="/register" element={<Register />} />
          {/* Route for dashboard (protected, after login) */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;