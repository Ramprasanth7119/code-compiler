FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
  nodejs \
  npm \
  python3 \
  python3-pip \
  openjdk-17-jdk \
  g++

# Set up app directory
WORKDIR /app
COPY . .

# Install Node dependencies
RUN npm install

# Start the app
CMD ["npm", "start"]
