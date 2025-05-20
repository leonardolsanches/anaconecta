#!/usr/bin/env python3
from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = 'ana-conecta/backend/db.json'

def load_data():
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

@app.route('/api/iniciativas', methods=['GET'])
def get_iniciativas():
    data = load_data()
    return jsonify(data['iniciativas'])

@app.route('/api/propostas', methods=['GET'])
def get_propostas():
    data = load_data()
    return jsonify(data['propostas'])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
