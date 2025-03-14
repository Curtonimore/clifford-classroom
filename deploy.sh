#!/bin/bash

# Clifford Classroom Deployment Script
# This script prepares and deploys the application to Vercel

# Set colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   Clifford Classroom Deployment Script   ${NC}"
echo -e "${GREEN}==================================================${NC}"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed.${NC}"
    echo -e "${YELLOW}Installing Vercel CLI globally...${NC}"
    npm install -g vercel
fi

# Clean up previous build files
echo -e "${YELLOW}Cleaning up previous build files...${NC}"
rm -rf .next
rm -rf out

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm ci
fi

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

# Run tests if they exist
if grep -q "\"test\":" package.json; then
    echo -e "${YELLOW}Running tests...${NC}"
    npm test
fi

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
echo -e "${YELLOW}You may be prompted to login if not already logged in.${NC}"

# Ask if this should be a production deployment
read -p "Is this a production deployment? (y/n): " is_prod
if [[ $is_prod == "y" || $is_prod == "Y" ]]; then
    echo -e "${YELLOW}Deploying to production...${NC}"
    vercel --prod
else
    echo -e "${YELLOW}Deploying to preview environment...${NC}"
    vercel
fi

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   Deployment process completed!   ${NC}"
echo -e "${GREEN}==================================================${NC}" 