#!/usr/bin/env node

/**
 * Vercel Admin Setup Script
 * 
 * This script helps with setting up admin users in the Vercel environment.
 * It verifies that the ADMIN_EMAILS environment variable is correctly set
 * and provides commands to set it through the Vercel CLI.
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for better terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.cyan}============================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}Vercel Admin Setup Assistant${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}============================${colors.reset}\n`);

// Check if Vercel CLI is installed
console.log(`${colors.bold}Checking for Vercel CLI...${colors.reset}`);
try {
  const vercelVersion = execSync('vercel --version').toString().trim();
  console.log(`${colors.green}✓ Vercel CLI found: ${vercelVersion}${colors.reset}\n`);
} catch (error) {
  console.log(`${colors.red}✗ Vercel CLI not found!${colors.reset}`);
  console.log(`${colors.yellow}Please install Vercel CLI using: npm i -g vercel${colors.reset}\n`);
  rl.close();
  process.exit(1);
}

// Function to check current environment variables
async function checkEnvironmentVariables() {
  console.log(`${colors.bold}Checking current environment variables...${colors.reset}`);
  try {
    const envOutput = execSync('vercel env list').toString();
    console.log(`${colors.blue}Current environment variables:${colors.reset}`);
    console.log(envOutput);
    
    // Check if ADMIN_EMAILS exists
    if (envOutput.includes('ADMIN_EMAILS')) {
      console.log(`${colors.green}✓ ADMIN_EMAILS environment variable exists.${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ ADMIN_EMAILS environment variable not found in Vercel.${colors.reset}`);
    }
    
    // Check if NEXT_PUBLIC_ADMIN_EMAILS exists (client-side version)
    if (envOutput.includes('NEXT_PUBLIC_ADMIN_EMAILS')) {
      console.log(`${colors.green}✓ NEXT_PUBLIC_ADMIN_EMAILS environment variable exists.${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ NEXT_PUBLIC_ADMIN_EMAILS environment variable not found in Vercel.${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}Error checking environment variables: ${error.message}${colors.reset}`);
  }
}

// Function to add admin emails
async function addAdminEmails() {
  return new Promise((resolve) => {
    rl.question(`\n${colors.bold}Enter admin email(s) separated by commas: ${colors.reset}`, (emails) => {
      if (!emails.trim()) {
        console.log(`${colors.red}No emails provided. Operation cancelled.${colors.reset}`);
        resolve(false);
        return;
      }
      
      // Clean up emails
      const cleanedEmails = emails
        .split(',')
        .map(e => e.trim())
        .filter(e => e.includes('@'))
        .join(',');
      
      if (!cleanedEmails) {
        console.log(`${colors.red}No valid emails provided. Operation cancelled.${colors.reset}`);
        resolve(false);
        return;
      }
      
      console.log(`\n${colors.cyan}Setting admin emails to: ${cleanedEmails}${colors.reset}`);
      
      try {
        // Set server-side admin emails
        console.log(`\n${colors.bold}Setting ADMIN_EMAILS...${colors.reset}`);
        execSync(`vercel env add ADMIN_EMAILS production`, { stdio: 'inherit' });
        
        // Set client-side admin emails
        console.log(`\n${colors.bold}Setting NEXT_PUBLIC_ADMIN_EMAILS...${colors.reset}`);
        execSync(`vercel env add NEXT_PUBLIC_ADMIN_EMAILS production`, { stdio: 'inherit' });
        
        console.log(`\n${colors.green}✓ Admin emails set successfully!${colors.reset}`);
        console.log(`${colors.yellow}Note: You may need to redeploy your application for changes to take effect.${colors.reset}`);
        
        resolve(true);
      } catch (error) {
        console.log(`${colors.red}Error setting admin emails: ${error.message}${colors.reset}`);
        resolve(false);
      }
    });
  });
}

// Function to redeploy the application
async function redeployApplication() {
  return new Promise((resolve) => {
    rl.question(`\n${colors.bold}Do you want to redeploy the application now? (y/N): ${colors.reset}`, (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log(`\n${colors.bold}Redeploying application...${colors.reset}`);
        try {
          execSync('vercel --prod', { stdio: 'inherit' });
          console.log(`\n${colors.green}✓ Redeployment initiated!${colors.reset}`);
          resolve(true);
        } catch (error) {
          console.log(`${colors.red}Error redeploying application: ${error.message}${colors.reset}`);
          resolve(false);
        }
      } else {
        console.log(`\n${colors.yellow}Skipping redeployment.${colors.reset}`);
        console.log(`${colors.yellow}You can manually redeploy using: vercel --prod${colors.reset}`);
        resolve(false);
      }
    });
  });
}

// Function to print admin setup information
function printAdminSetupInfo(adminEmails) {
  console.log(`\n${colors.bold}${colors.magenta}========== Admin Setup Information ==========${colors.reset}`);
  console.log(`${colors.bold}To verify your admin setup:${colors.reset}`);
  console.log(`1. Visit your deployed application`);
  console.log(`2. Go to /force-admin (e.g., https://your-app.vercel.app/force-admin)`);
  console.log(`3. Log in with one of these admin emails: ${colors.cyan}${adminEmails}${colors.reset}`);
  console.log(`4. Click the "Assign Admin Role" button`);
  console.log(`5. Sign out and sign back in to apply the changes`);
  console.log(`6. You should now have access to the admin dashboard at /admin/dashboard`);
  console.log(`\n${colors.yellow}If you encounter issues, check the MongoDB connection and logs in Vercel.${colors.reset}`);
}

// Main function
async function main() {
  // Check current environment variables
  await checkEnvironmentVariables();
  
  // Ask user if they want to set up admin emails
  rl.question(`\n${colors.bold}Do you want to set up admin emails now? (y/N): ${colors.reset}`, async (answer) => {
    if (answer.toLowerCase() === 'y') {
      const emailsAdded = await addAdminEmails();
      
      if (emailsAdded) {
        await redeployApplication();
        
        // Ask for admin emails again to display in the info
        rl.question(`\n${colors.bold}Please confirm the admin email(s) you've configured (for documentation): ${colors.reset}`, (emails) => {
          printAdminSetupInfo(emails.trim());
          rl.close();
        });
      } else {
        rl.close();
      }
    } else {
      console.log(`\n${colors.yellow}Skipping admin email setup.${colors.reset}`);
      rl.close();
    }
  });
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  rl.close();
  process.exit(1);
}); 