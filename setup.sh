#!/bin/bash

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

# Create .env file for server
echo "Creating server .env file..."
cp .env.example .env

# Install client dependencies
echo "Installing client dependencies..."
cd ../client
npm install

# Create .env file for client
echo "Creating client .env file..."
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

echo "Setup complete! To start the application:"
echo "1. Start MongoDB service"
echo "2. In the server directory: npm run dev"
echo "3. In the client directory: npm start" 