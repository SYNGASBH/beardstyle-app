FROM node:18-alpine

WORKDIR /app

# Install ImageMagick for WebP conversion (jpeg needed for JPEG decode delegate)
RUN apk add --no-cache imagemagick jpeg libwebp

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "run", "dev"]
