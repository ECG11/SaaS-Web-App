# Simple AI Chat SaaS Platform

A scalable and simple chat application with AI responses, authentication, and conversation history.

## Features
- User authentication (JWT)
- AI chatbot integration
- Conversation history tracking
- Dashboard with conversation management
- Multi-user support

## Tech Stack
**Frontend:** React.js  
**Backend:** Python/Flask  
**AI:** Rule-based response system  
**Storage:** JSON files (users, chat history)

---

## Installation

### Prerequisites
- **Frontend:** Node.js v16+  
- **Backend:** Python 3.9+, Flask, Flask-CORS, PyJWT

---

### Setup

#### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/chat-saas.git
cd chat-saas
```

#### 2. Install dependencies:

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
pip install flask flask-cors pyjwt
```

---

### Local Development

#### Start the services:

**Frontend:**
```bash
cd frontend
npm start
```

**Backend (in a separate terminal):**
```bash
cd backend
python app.py
```

---

## Environment Variables

### Frontend
Create a `.env` file in the `frontend` directory with the following:
```properties
REACT_APP_API_URL=http://localhost:5000
```

### Backend
Set the following environment variables in your local environment:
- `SECRET_KEY`: Your Flask secret key.

---

## API Documentation

| Endpoint         | Method | Description                  |
|-------------------|--------|------------------------------|
| `/register`       | POST   | User registration            |
| `/login`          | POST   | User login                   |
| `/chat`           | POST   | Send message to AI           |
| `/history`        | GET    | Get user chat history        |
| `/history/<date>` | DELETE | Delete conversation by date  |

---

## Notes
- Ensure the backend is running on `http://localhost:5000` and the frontend is configured to communicate with it.
- Test the application locally to verify the frontend and backend are communicating correctly.

---

## License
This project is licensed under the MIT License.