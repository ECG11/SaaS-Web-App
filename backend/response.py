import random

def generate_bot_response(message, user_name=None):
    print(f"Received message: {message}")
    print(f"User name: {user_name}")

    if message.lower() == "hi":
        return "Hello! How can I assist you today?"
    elif message.lower() == "what's your name" or message.lower() == "who are you":
        return "I'm a simple AI chatbot. How about you? What's your name?"
    elif message.lower() == "how are you?":
        return "I'm doing great, thank you for asking! How about you?"
    elif message.lower().startswith("my name is"):
        name = message[11:].strip()
        if name:
            return f"Hello, {name}! How are you?"
        else:
            return "Nice to meet you! What's your name?"
    elif message.lower() in ["say something", "talk to me", "tell me something"]:
        return "Sure! I can chat with you. Ask me anything!"
    elif message.lower() == "tell me a fun fact":
        fun_facts = [
            "Did you know? Honey never spoils. Archaeologists have found pots of honey in ancient tombs that are over 3000 years old!",
            "Did you know? A group of flamingos is called a 'flamboyance'.",
            "Did you know? Your nose can remember 50,000 different scents!"
        ]
        return random.choice(fun_facts)
    return "I'm not sure how to respond to that. Can you ask something else?"