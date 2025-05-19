from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/iniciativas', methods=['GET'])
def get_iniciativas():
    with open('db.json') as f:
        data = json.load(f)
    return jsonify(data['iniciativas'])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)