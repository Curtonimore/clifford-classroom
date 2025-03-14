#!/usr/bin/env node

// This script checks Vercel environment variables
// Make sure to run `npx vercel login` first
// Then run `node scripts/check-vercel-env.js`

const { execSync } = require('child_process');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.bright}${colors.blue}Vercel Environment Variable Checker${colors.reset}\n`);

try {
  console.log(`${colors.yellow}Checking if you're logged in to Vercel...${colors.reset}`);
  
  // Check if user is logged in
  try {
    const whoami = execSync('npx vercel whoami', { stdio: 'pipe' }).toString().trim();
    console.log(`${colors.green}✓ Logged in as: ${whoami}${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ Not logged in to Vercel. Please run 'npx vercel login' first.${colors.reset}`);
    process.exit(1);
  }
  
  // Get project info
  console.log(`${colors.yellow}Fetching project information...${colors.reset}`);
  const projectInfo = JSON.parse(execSync('npx vercel project ls --json', { stdio: 'pipe' }).toString());
  
  if (!projectInfo || !projectInfo.length) {
    console.error(`${colors.red}✗ No projects found. Make sure you're linked to a project.${colors.reset}`);
    process.exit(1);
  }
  
  const project = projectInfo[0]; // Assuming first project
  console.log(`${colors.green}✓ Found project: ${project.name}${colors.reset}\n`);
  
  // Now check for environment variables
  console.log(`${colors.yellow}Checking environment variables...${colors.reset}`);
  const envInfo = JSON.parse(execSync(`npx vercel env ls ${project.id} --json`, { stdio: 'pipe' }).toString());
  
  if (!envInfo || !envInfo.length) {
    console.error(`${colors.red}✗ No environment variables found.${colors.reset}`);
    process.exit(1);
  }
  
  // Group by environment
  const envsByTarget = {};
  envInfo.forEach(env => {
    if (!envsByTarget[env.target]) {
      envsByTarget[env.target] = [];
    }
    envsByTarget[env.target].push(env);
  });
  
  // Print environment variables, masking secrets
  Object.keys(envsByTarget).forEach(target => {
    console.log(`\n${colors.bright}${colors.magenta}Environment: ${target}${colors.reset}`);
    console.log(`${colors.bright}${'─'.repeat(50)}${colors.reset}`);
    
    const envs = envsByTarget[target];
    const criticalVars = ['MONGODB_URI', 'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'NEXTAUTH_SECRET'];
    
    // First check for critical variables
    console.log(`\n${colors.bright}Critical Variables:${colors.reset}`);
    criticalVars.forEach(varName => {
      const env = envs.find(e => e.key === varName);
      if (env) {
        // For MongoDB URI, do a bit more analysis
        if (varName === 'MONGODB_URI') {
          const value = env.value || '';
          const isMongoDB = value.startsWith('mongodb://') || value.startsWith('mongodb+srv://');
          const hasCredentials = value.includes('@');
          console.log(`${colors.green}✓ ${varName}: ${isMongoDB ? 'Valid format' : 'Invalid format'}, ${hasCredentials ? 'Has credentials' : 'Missing credentials'}`);
        } else {
          console.log(`${colors.green}✓ ${varName}: [Set]${colors.reset}`);
        }
      } else {
        console.log(`${colors.red}✗ ${varName}: [Missing]${colors.reset}`);
      }
    });
    
    // Then list all other variables
    console.log(`\n${colors.bright}All Variables:${colors.reset}`);
    envs.forEach(env => {
      if (!criticalVars.includes(env.key)) {
        let value = env.value || '';
        if (value.length > 20) {
          value = value.substring(0, 10) + '...' + value.substring(value.length - 5);
        }
        console.log(`- ${env.key}: ${value}`);
      }
    });
  });
  
  console.log(`\n${colors.bright}${colors.green}Environment check complete!${colors.reset}`);
} catch (error) {
  console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
} 