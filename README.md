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
git clone https://github.com/ECG11/SaaS-Web-App
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

## Architecture Decisions and Approach

### **Frontend**
1. **React.js**:
   - React is used for building the user interface due to its component-based architecture, which allows for reusable and maintainable code.
   - State management is handled using React's `useState` hook for simplicity.
   - Navigation is implemented using `react-router-dom` to manage routes like `/register`, `/login`, `/dashboard`, and `/chatbox`.

2. **Axios for API Requests**:
   - Axios is used for making HTTP requests to the backend because it provides a clean API for handling requests and responses, including error handling.

3. **Environment Variables**:
   - The frontend uses a `.env` file to store the backend API URL (`REACT_APP_API_URL`), making it easy to switch between development and production environments.

4. **Error Handling**:
   - Error messages from the backend are displayed to the user for better feedback.
   - Success messages are shown for actions like registration.

---

### **Backend**
1. **Flask Framework**:
   - Flask is used for its lightweight and flexible nature, making it easy to build RESTful APIs.

2. **JWT Authentication**:
   - JSON Web Tokens (JWT) are used for secure user authentication. Tokens are generated during login and stored in the frontend for subsequent API requests.

3. **File-Based Storage**:
   - User data is stored in `users.json`, and chat history is stored in `chat_history.json`. While this is sufficient for small-scale applications, it can be migrated to a database for scalability.

4. **CORS Configuration**:
   - Flask-CORS is used to allow cross-origin requests from the frontend running on a different port (e.g., `http://localhost:3000`).

5. **Error Logging**:
   - Errors are logged using Python's `logging` module to help with debugging and monitoring.

6. **Endpoints**:
   - `/register`: Handles user registration and saves user data to `users.json`.
   - `/login`: Authenticates users and generates JWT tokens.
   - `/history`: Retrieves chat history for the logged-in user.
   - `/history/<date>`: Deletes chat history for a specific date.

---

### **General Approach**
1. **Separation of Concerns**:
   - The frontend and backend are decoupled, allowing independent development and testing.
   - The frontend handles user interactions, while the backend manages data and business logic.

2. **Scalability**:
   - While the current implementation uses JSON files for storage, the architecture allows for easy migration to a database like PostgreSQL or MongoDB.

3. **Security**:
   - Sensitive data like the `SECRET_KEY` is stored in environment variables.
   - JWT tokens are used for secure authentication.

4. **User Experience**:
   - The application provides clear feedback to users through success and error messages.
   - Navigation is intuitive, with routes for registration, login, and dashboard access.

---

## Notes
- Ensure the backend is running on `http://localhost:5000` and the frontend is configured to communicate with it.
- Test the application locally to verify the frontend and backend are communicating correctly.

---

## License
This project is licensed under the MIT License.