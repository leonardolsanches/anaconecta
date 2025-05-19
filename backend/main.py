#!/usr/bin/env python3
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder="../frontend", template_folder="../frontend")
CORS(app)

@app.route('/api/iniciativas', methods=['GET'])
def get_iniciativas():
    with open('db.json') as f:
        data = json.load(f)
    return jsonify(data['iniciativas'])

@app.route('/')
@app.route('/<path:path>')
def serve_frontend(path="index.html"):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)