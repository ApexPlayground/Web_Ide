from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import subprocess
import os
import tempfile
import traceback

app = Flask(__name__, static_folder="../Frontend", template_folder="../Frontend")
CORS(app)

@app.route('/')
def root():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/compile', methods=['POST'])
def compile_code():
    try:
        if not request.is_json or 'code' not in request.json:
            return jsonify({'error': 'Invalid request data'}), 400
        
        code = request.json['code']

        # Create a temporary directory to hold the C file and executable
        with tempfile.TemporaryDirectory() as tmpdirname:
            c_filename = os.path.join(tmpdirname, "program.c")
            executable_filename = os.path.join(tmpdirname, "program")

            # Write the code to a file
            with open(c_filename, 'w') as f:
                f.write(code)

            # Compile C code without -mconsole flag
            compile_result = subprocess.run(['gcc', c_filename, '-o', executable_filename], capture_output=True, text=True)
            if compile_result.returncode != 0:
                return jsonify({'error': compile_result.stderr}), 400

            # Execute the compiled program
            execute_result = subprocess.run([executable_filename], capture_output=True, text=True)
            if execute_result.returncode != 0:
                return jsonify({'error': execute_result.stderr}), 400

            return jsonify({'output': execute_result.stdout}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
