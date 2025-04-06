import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const Chatbox = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const username = localStorage.getItem("username") || "";

  useEffect(() => {
    const loadHistory = () => {
      const savedConversation = localStorage.getItem(`selectedConversation_${username}`);
      if (savedConversation) {
        setChatHistory(JSON.parse(savedConversation));
        localStorage.removeItem(`selectedConversation_${username}`);
      } else {
        const recentChats = localStorage.getItem(`recentChats_${username}`);
        if (recentChats) setChatHistory(JSON.parse(recentChats));
      }
    };

    loadHistory();
  }, [username]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Create user message object
    const userMessage = { 
      sender: "user", 
      text: message,
      timestamp: new Date().toISOString()
    };

    try {
      // Update UI immediately
      setChatHistory(prev => [...prev, userMessage]);
      
      // Send to backend
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message, 
          username: username 
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      // Get bot response
      const data = await response.json();
      const botMessage = { 
        sender: "bot", 
        text: data.response,
        timestamp: new Date().toISOString()
      };

      // Update chat history
      setChatHistory(prev => [...prev, botMessage]);
      
      // Save to localStorage
      const updatedHistory = [...chatHistory, userMessage, botMessage];
      localStorage.setItem(`recentChats_${username}`, JSON.stringify(updatedHistory));
      
      setMessage("");

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

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <h3>Chat with AI</h3>
        <button 
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
      
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
      
      <form onSubmit={handleSendMessage}>
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
  );
};

export default Chatbox;