from flask import Flask, jsonify
import os
from flask_cors import CORS

app = Flask(__name__)

# Initialize CORS with default options
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    path = "C:/Users/7394/Downloads\TESTREAD.txt"
    with open(path, 'r') as file:
    # Read all lines starting from the second line (line 1)
        lines = file.readlines()
        # data = {
        #     'data': lines
        # }
        print(lines)
        file_name = os.path.basename(path)
    return jsonify({
        'data': lines,
        'fileName': file_name
    })

if __name__ == '__main__':
    app.run(debug=True)
