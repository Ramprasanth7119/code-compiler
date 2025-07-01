FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Copy the runner script
COPY runner.py .

# By default, the container will run runner.py
CMD ["python3", "runner.py"]
