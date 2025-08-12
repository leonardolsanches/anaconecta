import os
import logging
from flask import Flask
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "ana-conecta-secret-key")

# Import routes after app is created to avoid circular imports
from routes import *

# Initialize in-memory database
from models import initialize_db

initialize_db()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
