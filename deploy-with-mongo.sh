#!/bin/bash

# Text formatting
BOLD="\033[1m"
RED="\033[31m"
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
MAGENTA="\033[35m"
CYAN="\033[36m"
RESET="\033[0m"

# Header
echo -e "${BOLD}${CYAN}=========================================${RESET}"
echo -e "${BOLD}${CYAN}   Vercel Deployment with MongoDB Setup   ${RESET}"
echo -e "${BOLD}${CYAN}=========================================${RESET}\n"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI not found!${RESET}"
    echo -e "${YELLOW}Installing Vercel CLI...${RESET}"
    npm install -g vercel
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}Failed to install Vercel CLI. Please install it manually with: npm install -g vercel${RESET}"
        exit 1
    fi
    
    echo -e "${GREEN}Vercel CLI installed successfully!${RESET}"
fi

echo -e "${BOLD}Vercel CLI: ${RESET}$(vercel --version)"

# Check if MongoDB URI is set
echo -e "\n${BOLD}Checking MongoDB configuration...${RESET}"
vercel env ls | grep MONGODB_URI > /dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ MONGODB_URI environment variable exists${RESET}"
else
    echo -e "${YELLOW}⚠ MONGODB_URI environment variable not found${RESET}"
    
    read -p "Do you want to set up MONGODB_URI now? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BOLD}Setting up MongoDB URI...${RESET}"
        echo -e "${BLUE}You will be prompted to enter your MongoDB connection string.${RESET}"
        echo -e "${BLUE}It should look like: mongodb+srv://username:password@cluster.mongodb.net/database${RESET}"
        
        vercel env add MONGODB_URI
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ MONGODB_URI environment variable set successfully${RESET}"
        else
            echo -e "${RED}✗ Failed to set MONGODB_URI environment variable${RESET}"
            exit 1
        fi
    fi
fi

# Check for admin emails
echo -e "\n${BOLD}Checking admin configuration...${RESET}"
vercel env ls | grep ADMIN_EMAILS > /dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ADMIN_EMAILS environment variable exists${RESET}"
else
    echo -e "${YELLOW}⚠ ADMIN_EMAILS environment variable not found${RESET}"
    
    read -p "Do you want to set up ADMIN_EMAILS now? (y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BOLD}Setting up admin emails...${RESET}"
        echo -e "${BLUE}Enter comma-separated list of emails that should have admin access:${RESET}"
        read admin_emails
        
        if [ -z "$admin_emails" ]; then
            echo -e "${RED}No emails provided. Skipping admin setup.${RESET}"
        else
            vercel env add ADMIN_EMAILS
            
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✓ ADMIN_EMAILS environment variable set successfully${RESET}"
                
                # Also set NEXT_PUBLIC_ADMIN_EMAILS
                echo -e "${BOLD}Setting up NEXT_PUBLIC_ADMIN_EMAILS...${RESET}"
                vercel env add NEXT_PUBLIC_ADMIN_EMAILS
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✓ NEXT_PUBLIC_ADMIN_EMAILS environment variable set successfully${RESET}"
                else
                    echo -e "${RED}✗ Failed to set NEXT_PUBLIC_ADMIN_EMAILS environment variable${RESET}"
                fi
            else
                echo -e "${RED}✗ Failed to set ADMIN_EMAILS environment variable${RESET}"
            fi
        fi
    fi
fi

# Offer to add test MongoDB data
echo -e "\n${BOLD}Database Initialization${RESET}"
read -p "Would you like to add a test admin user to MongoDB? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Get email for admin
    echo -e "${BLUE}Enter the email for the admin user:${RESET}"
    read admin_email
    
    if [ -z "$admin_email" ]; then
        echo -e "${RED}No email provided. Skipping admin user creation.${RESET}"
    else
        # Get MongoDB URI for direct access
        echo -e "${BLUE}Enter your MongoDB connection string to add the admin user directly:${RESET}"
        read mongodb_uri
        
        if [ -z "$mongodb_uri" ]; then
            echo -e "${YELLOW}No MongoDB URI provided. We'll use the API method instead.${RESET}"
            echo -e "${YELLOW}After deployment, visit /force-admin to create an admin user.${RESET}"
        else
            echo -e "${BOLD}This feature requires MongoDB Shell installed.${RESET}"
            echo -e "${YELLOW}If you don't have MongoDB Shell installed, you can manually add the user${RESET}"
            echo -e "${YELLOW}or use the /force-admin page after deployment.${RESET}"
            
            if command -v mongosh &> /dev/null; then
                echo -e "${GREEN}MongoDB Shell found!${RESET}"
                
                # Extract database name from URI
                db_name=$(echo $mongodb_uri | sed -n 's/.*\/\([^?]*\).*/\1/p')
                
                if [ -z "$db_name" ]; then
                    db_name="admin-db"
                    echo -e "${YELLOW}Could not extract database name from URI. Using '$db_name' as default.${RESET}"
                fi
                
                # Create a temporary JS file for MongoDB shell
                tmp_file=$(mktemp)
                
                cat > $tmp_file << EOF
db.getSiblingDB("$db_name").users.updateOne(
  { email: "$admin_email" },
  { 
    \$set: {
      name: "Admin User",
      email: "$admin_email",
      role: "admin",
      subscription: {
        tier: "premium",
        aiCreditsRemaining: 100,
        features: ["unlimited_plan_storage", "ai_lesson_plans", "premium_templates"],
        expiresAt: null
      },
      createdAt: new Date()
    } 
  },
  { upsert: true }
);
EOF
                
                echo -e "${BOLD}Adding admin user to MongoDB...${RESET}"
                mongosh "$mongodb_uri" --file $tmp_file
                
                # Clean up
                rm $tmp_file
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✓ Admin user added successfully!${RESET}"
                else
                    echo -e "${RED}✗ Failed to add admin user to MongoDB.${RESET}"
                    echo -e "${YELLOW}After deployment, visit /force-admin to create an admin user.${RESET}"
                fi
            else
                echo -e "${YELLOW}MongoDB Shell not found. Skipping direct database update.${RESET}"
                echo -e "${YELLOW}After deployment, visit /force-admin to create an admin user.${RESET}"
            fi
        fi
    fi
fi

# Deploy to Vercel
echo -e "\n${BOLD}Ready to deploy!${RESET}"
read -p "Do you want to deploy to Vercel now? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BOLD}${CYAN}Deploying to Vercel...${RESET}"
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}${BOLD}Deployment completed successfully!${RESET}"
        
        echo -e "\n${BOLD}${MAGENTA}==== Post-Deployment Steps ====${RESET}"
        echo -e "${BOLD}1. Visit your deployed application${RESET}"
        echo -e "${BOLD}2. To set up an admin user, go to /force-admin${RESET}"
        echo -e "${BOLD}3. Sign in with an email that's in your ADMIN_EMAILS list${RESET}"
        echo -e "${BOLD}4. Click the \"Assign Admin Role\" button${RESET}"
        echo -e "${BOLD}5. Sign out and sign back in${RESET}"
        echo -e "${BOLD}6. You should now have access to the admin dashboard at /admin/dashboard${RESET}"
        echo -e "\n${YELLOW}If you encounter any issues, check the VERCEL-DEPLOY.md and ADMIN-SETUP.md files for troubleshooting.${RESET}"
    else
        echo -e "${RED}Deployment failed!${RESET}"
        echo -e "${YELLOW}Please check the error messages above and try again.${RESET}"
    fi
else
    echo -e "${YELLOW}Deployment cancelled.${RESET}"
    echo -e "${BLUE}You can deploy manually with: ${BOLD}vercel --prod${RESET}"
fi

echo -e "\n${BOLD}${CYAN}Script completed!${RESET}" 