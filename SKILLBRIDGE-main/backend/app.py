from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from routes import api_bp

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)
