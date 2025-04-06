import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './App.css';

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [showMenuId, setShowMenuId] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const grouped = response.data.reduce((acc, message) => {
          const date = new Date(message.timestamp).toDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(message);
          return acc;
        }, {});

        setConversations(Object.entries(grouped));
      } catch (err) {
        console.error("Error fetching chat history", err);
      }
    };

    fetchHistory();
  }, [navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = { 
      sender: "user", 
      text: message,
      timestamp: new Date().toISOString()
    };

    try {
      setChatHistory(prev => [...prev, newMessage]);
      
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, username }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const botMessage = { 
        sender: "bot", 
        text: data.response,
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, botMessage]);
      setMessage("");

      const updatedHistory = [...chatHistory, newMessage, botMessage];
      localStorage.setItem(`recentChats_${username}`, JSON.stringify(updatedHistory));

    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMessage = { 
        sender: "bot", 
        text: "Error: Could not get AI response",
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const handleSelectConversation = (conversation) => {
    const transformed = conversation[1].flatMap(msg => [
      { sender: "user", text: msg.message, timestamp: msg.timestamp },
      { sender: "bot", text: msg.response, timestamp: msg.timestamp }
    ]);
    setActiveConversation(conversation[0]);
    setChatHistory(transformed);
  };

  const handleDeleteConversation = async (date) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/history/${encodeURIComponent(date)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConversations(prev => prev.filter(([convDate]) => convDate !== date));
      if (activeConversation === date) {
        setActiveConversation(null);
        setChatHistory([]);
      }
      setShowMenuId(null);
    } catch (err) {
      console.error("Error deleting conversation", err);
    }
  };

  const handleNewChat = () => {
    setActiveConversation(null);
    setChatHistory([]);
    localStorage.removeItem(`recentChats_${username}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem(`recentChats_${username}`);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome, {username}</h2>
        <div className="dashboard-actions">
          <button onClick={handleNewChat}>New Chat</button>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="conversation-list">
          <h3>Conversation History</h3>
          {conversations.map(([date, messages], index) => (
            <div 
              key={index}
              className={`conversation-item ${activeConversation === date ? 'active' : ''}`}
            >
              <div className="conversation-header">
                <span className="conversation-date">{date}</span>
                <div className="conversation-menu">
                  <button 
                    className="menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenuId(showMenuId === date ? null : date);
                    }}
                  >
                    ⋮
                  </button>
                  {showMenuId === date && (
                    <div className="menu-dropdown">
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteConversation(date)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div 
                className="conversation-preview"
                onClick={() => handleSelectConversation([date, messages])}
              >
                {messages[0].message.substring(0, 40)}...
              </div>
            </div>
          ))}
        </div>

        <div className="chat-panel">
          <div className="chat-history">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p className="message-text">{msg.text}</p>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          
          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoFocus
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;