FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE $PORT

# Start local server
# Using ts-node to run directly without building
CMD ["npx", "ts-node", "src/local-server.ts"]
