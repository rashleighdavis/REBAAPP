#!/bin/bash

echo "========================================"
echo "  REBA - Quick Deploy Script"
echo "========================================"
echo ""

echo "Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies"
    exit 1
fi

echo ""
echo "Building production version..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
fi

echo ""
echo "========================================"
echo "  Build Complete!"
echo "========================================"
echo ""
echo "Your app is ready to deploy."
echo ""
echo "Choose your deployment method:"
echo "  1. Vercel (Recommended)"
echo "  2. Netlify"
echo "  3. Exit"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Deploying to Vercel..."
        npx vercel
        ;;
    2)
        echo ""
        echo "To deploy to Netlify:"
        echo "1. Go to https://app.netlify.com/drop"
        echo "2. Drag and drop the 'dist' folder"
        echo ""
        open https://app.netlify.com/drop 2>/dev/null || xdg-open https://app.netlify.com/drop 2>/dev/null
        open dist 2>/dev/null || xdg-open dist 2>/dev/null
        ;;
    3)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
