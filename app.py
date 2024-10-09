from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Simulación de datos de usuarios
users = [
    {"id": 1, "name": "Alice", "music_tastes": ["rock", "pop"], "sexuality": "straight", "relationship": "friendship", "photo": "alice.jpg"},
    {"id": 2, "name": "Bob", "music_tastes": ["pop", "jazz"], "sexuality": "gay", "relationship": "romance", "photo": "bob.jpg"},
    {"id": 3, "name": "Charlie", "music_tastes": ["rock", "hip hop"], "sexuality": "straight", "relationship": "romance", "photo": "charlie.jpg"},
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/match')
def match():
    return render_template('match.html')    

@app.route('/get_users')
def get_users():
    return jsonify(users)

if __name__ == "__main__":
    app.run(debug=True)
