
# Setup
FROM node:latest
RUN mkdir -p /app
WORKDIR /app

# Install packages
COPY package*.json /app/
RUN npm install

# Copy project to /app/
COPY . /app/
EXPOSE $PORT


# Start the app
CMD [ "npm", "start" ]

