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
        # Ensure request data is valid JSON and contains 'code' field
        if not request.is_json or 'code' not in request.json:
            return jsonify({'error': 'Invalid request data'}), 400
        
        code = request.json['code']

        # Create a temporary file to store the code
        with tempfile.NamedTemporaryFile(delete=False, suffix='.py', mode='w') as tmpfile:
            tmpfile.write(code)
            tmpfilename = tmpfile.name

        # Execute the code using subprocess
        result = subprocess.run(['python', '-c', code], capture_output=True, text=True)
        
        # Check if there's any error in execution
        if result.returncode != 0:
            return jsonify({'error': result.stderr}), 400
        
        # Return the output
        return jsonify({'output': result.stdout}), 200
    
    except SyntaxError as e:
        # Catch syntax errors and return them
        error_message = traceback.format_exc()
        return jsonify({'error': error_message}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Remove the temporary file
        if 'tmpfilename' in locals() and os.path.exists(tmpfilename):
            os.remove(tmpfilename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
