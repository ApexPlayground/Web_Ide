# Use an official OpenJDK runtime as a base image
FROM openjdk:11

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt /app/

# Install Python pip and Flask for the Flask app
RUN apt-get update && \
    apt-get install -y python3-pip && \
    pip3 install --no-cache-dir -r requirements.txt && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy the current directory contents into the container at /app
COPY . /app

# Make port 5001 available to the world outside this container
EXPOSE 5001

# Define environment variable
ENV FLASK_APP app.py

# Run app.py when the container launches
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]
