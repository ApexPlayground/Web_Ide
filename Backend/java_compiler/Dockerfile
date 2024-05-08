FROM python:3.9-slim
RUN apt-get update && apt-get install -y openjdk-17-jdk-headless
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5001
ENV FLASK_APP=app.py
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]
