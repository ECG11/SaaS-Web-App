from flask import Flask, jsonify, request
import json
import datetime
import jwt
import os
from flask_cors import CORS
from response import generate_bot_response

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'your-secret-key'

# Helper functions
def load_users():
    try:
        with open('users.json', 'r') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading users: {str(e)}")
        return {}

def save_users(users):
    try:
        with open('users.json', 'w') as file:
            json.dump(users, file)
    except Exception as e:
        print(f"Error saving users: {str(e)}")

def generate_token(username):
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    return jwt.encode(
        {'username': username, 'exp': expiration_time},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )

def load_chat_history():
    try:
        with open('chat_history.json', 'r') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading chat history: {str(e)}")
        return []

def save_chat_history(chat_history):
    try:
        with open('chat_history.json', 'w') as file:
            json.dump(chat_history, file)
    except Exception as e:
        print(f"Error saving chat history: {str(e)}")

# Routes
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"msg": "Username and password required!"}), 400

        users = load_users()
        if username in users:
            return jsonify({"msg": "Username already exists!"}), 400

        users[username] = {'username': username, 'password': password}
        save_users(users)

        token = generate_token(username)
        return jsonify({
            "msg": "Registration successful!",
            "access_token": token,
            "username": username
        }), 201

    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({"msg": "Internal server error"}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"msg": "Username and password required!"}), 400

        users = load_users()
        user = users.get(username)

        if not user or user['password'] != password:
            return jsonify({"msg": "Invalid credentials"}), 401

        token = generate_token(username)
        return jsonify({
            'access_token': token,
            'username': username
        }), 200

    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({"msg": "Internal server error"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        username = data.get('username')

        if not message or not username:
            return jsonify({"msg": "Message and username required!"}), 400

        bot_response = generate_bot_response(message, username)
        
        chat_history = load_chat_history()
        chat_history.append({
            "user": username,
            "message": message,
            "response": bot_response,
            "timestamp": datetime.datetime.now().isoformat()
        })
        save_chat_history(chat_history)

        return jsonify({"response": bot_response}), 200

    except Exception as e:
        print(f"Chat error: {str(e)}")
        return jsonify({"msg": "Internal server error"}), 500

@app.route('/history', methods=['GET'])
def get_chat_history():
    try:
        token = request.headers.get('Authorization').split()[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded['username']
        
        chat_history = load_chat_history()
        user_history = [msg for msg in chat_history if msg['user'] == username]
        
        return jsonify(user_history), 200
    except Exception as e:
        print(f"History error: {str(e)}")
        return jsonify({"msg": "Error loading history"}), 500

@app.route('/history/<date>', methods=['DELETE'])
def delete_conversation(date):
    try:
        token = request.headers.get('Authorization').split()[1]
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        username = decoded['username']
        
        chat_history = load_chat_history()
        
        # Filter out messages that don't match both user and date
        filtered_history = [
            msg for msg in chat_history 
            if not (msg['user'] == username and msg['timestamp'].startswith(date))
        ]
        
        save_chat_history(filtered_history)
        return jsonify({"msg": "Conversation deleted"}), 200
        
    except Exception as e:
        print(f"Delete error: {str(e)}")
        return jsonify({"msg": "Error deleting conversation"}), 500

if __name__ == '__main__':
    app.run(debug=True)