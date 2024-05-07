# Start with a base image that includes Python
FROM python:3.9-slim

# Install GCC to compile C code
RUN apt-get update && \
    apt-get install -y gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory in the Docker container
WORKDIR /app

# Copy the Flask application's files into the container
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port the Flask app runs on
EXPOSE 5002

# Environment variable to specify the main application script
ENV FLASK_APP app.py

# Command to run the Flask application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5002"]
