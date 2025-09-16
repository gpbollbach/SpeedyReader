#!/bin/bash

# This script updates the repository and starts the development server
# with the in-memory database.

echo "Pulling latest changes from git..."
git pull

echo "Starting development server with in-memory database..."
npm run dev -- --db-type=in-memory
