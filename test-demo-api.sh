#!/bin/bash

# Test script for demo lesson plan API
# This script tests the lesson plan generation with the force demo mode header

DEPLOYMENT_URL="https://clifford-classroom-9yoz2g4pl-curtis-cliffords-projects.vercel.app"
API_ENDPOINT="/api/generate-lesson-plan"

echo "Testing demo lesson plan API at $DEPLOYMENT_URL$API_ENDPOINT..."
echo "---------------------------------------------------------"

# Create a test payload
PAYLOAD='{
  "subject": "mathematics",
  "audience": "elementary",
  "topic": "fractions",
  "time": "45 minutes"
}'

# Make the API request with the force demo mode header
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "X-Force-Demo-Mode: true" \
  -d "$PAYLOAD" \
  "$DEPLOYMENT_URL$API_ENDPOINT" | head -n 20

echo
echo "---------------------------------------------------------"
echo "Test completed. If you see JSON output above, the demo mode is working!"
echo "If you see an authentication page, there's still an issue with bypassing auth." 