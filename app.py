from flask import Flask, render_template, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/match')
def match():
    return render_template('match.html')

if __name__ == "__main__":
    app.run(debug=True)
