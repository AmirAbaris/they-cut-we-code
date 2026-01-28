FROM node:20-bookworm-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build
RUN npm run build

# Create necessary directories
RUN mkdir -p data tmp

# Expose port
EXPOSE 4000

# Start
CMD ["npm", "run", "start:prod"]
