from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import tempfile
import re
import traceback

app = Flask(__name__, static_folder="../Frontend", template_folder="../Frontend")
CORS(app)

@app.route('/')
def root():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/compile', methods=['POST'])
def compile_code():
    try:
        if not request.is_json or 'code' not in request.json or 'language' not in request.json:
            return jsonify({'error': 'Invalid request data'}), 400
        
        code = request.json['code']
        language = request.json['language']

        if language != 'Java':
            return jsonify({'error': 'Unsupported language'}), 400

        # Extract the public class name from the Java code
        match = re.search(r'public\s+class\s+(\w+)', code)
        if not match:
            return jsonify({'error': 'No public class found in the submitted code'}), 400
        
        class_name = match.group(1)
        file_name = f"{class_name}.java"

        # Create a temporary directory to hold the Java file
        with tempfile.TemporaryDirectory() as tmpdirname:
            tmpfilename = os.path.join(tmpdirname, file_name)
            with open(tmpfilename, 'w') as f:
                f.write(code)
            
            # Compile Java code
            compile_result = subprocess.run(['javac', tmpfilename], capture_output=True, text=True)
            if compile_result.returncode != 0:
                return jsonify({'error': compile_result.stderr}), 400

            # Execute compiled Java program
            execute_result = subprocess.run(['java', '-cp', tmpdirname, class_name], capture_output=True, text=True)
            if execute_result.returncode != 0:
                return jsonify({'error': execute_result.stderr}), 400
            return jsonify({'output': execute_result.stdout}), 200
    
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
