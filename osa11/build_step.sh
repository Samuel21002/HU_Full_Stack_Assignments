#!/bin/bash
set -e

echo "Building frontend..."
cd "exercise 4.1-5.23_Frontend"
npm install
npm run build
cd ..

echo "Moving dist folder to backend..."
rm -rf "exercise 4.1-4.23_Backend/dist"
mv "exercise 4.1-5.23_Frontend/dist" "exercise 4.1-4.23_Backend/dist"

echo "Installing backend dependencies..."
cd "exercise 4.1-4.23_Backend"
npm install

echo "Build completed successfully!"
