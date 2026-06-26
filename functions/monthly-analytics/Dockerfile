# Use official lightweight Node.js image
FROM node:20-slim

# Create and define the working directory
WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy local code to the container image
COPY . .

# Run the web service on container startup
CMD [ "npm", "start" ]
