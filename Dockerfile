# Build stage
FROM node:14 AS builder

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:14

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies for development mode)
RUN npm install

# Copy built assets from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy source files for development mode
COPY ./src ./src

# Copy tsconfig.json for development mode
COPY tsconfig.json .

# Set NODE_ENV to production by default
ENV NODE_ENV production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]