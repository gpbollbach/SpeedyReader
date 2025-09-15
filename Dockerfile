# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy built assets from the builder stage
COPY --from=builder /app/dist ./dist

# Set environment to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
