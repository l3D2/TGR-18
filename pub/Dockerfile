# FROM oven/bun:1 AS base
# WORKDIR /sourcecode

# FROM base AS install
# COPY package.json /sourcecode/
# RUN bun install

# FROM base AS build
# COPY . /sourcecode/
# CMD ["bun", "run", "start"]

# Use a Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["npm", "start"]
