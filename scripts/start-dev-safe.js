#!/usr/bin/env node

/**
 * Enhanced Next.js dev starter script with better error handling
 * and memory management to prevent crashes
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const MAX_OLD_SPACE_SIZE = 4096; // Increased memory limit (adjust based on your system)
const RESTART_DELAY = 2000; // 2 seconds
const MAX_RESTARTS = 5;
const LOG_FILE = path.join(__dirname, '../dev-server.log');

// Clear previous log file
if (fs.existsSync(LOG_FILE)) {
  fs.truncateSync(LOG_FILE, 0);
}

// Helper to log to both console and file
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

// Track restarts
let restartCount = 0;

// Function to start the Next.js dev server
function startDevServer() {
  log(`Starting Next.js dev server (attempt ${restartCount + 1}/${MAX_RESTARTS})`);
  
  // Set up environment for better performance and debugging
  const env = {
    ...process.env,
    NODE_OPTIONS: `--max-old-space-size=${MAX_OLD_SPACE_SIZE} --trace-warnings --unhandled-rejections=strict`
  };
  
  // Start Next.js with the custom environment
  const nextBin = path.join(__dirname, '../node_modules/.bin/next');
  const nextProcess = spawn(nextBin, ['dev'], { 
    env,
    stdio: 'pipe', // Capture all output
    shell: true
  });
  
  log(`Next.js process started with PID: ${nextProcess.pid}`);
  log(`Memory limit set to ${MAX_OLD_SPACE_SIZE}MB`);

  // Handle stdout (normal output)
  nextProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(output);
    fs.appendFileSync(LOG_FILE, output + '\n');
  });

  // Handle stderr (errors and warnings)
  nextProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    console.error(output);
    fs.appendFileSync(LOG_FILE, `ERROR: ${output}\n`);
  });

  // Handle process exit
  nextProcess.on('exit', (code, signal) => {
    if (code !== 0) {
      log(`Next.js process exited with code ${code} and signal ${signal}`);
      
      if (restartCount < MAX_RESTARTS) {
        restartCount++;
        log(`Restarting in ${RESTART_DELAY/1000} seconds...`);
        setTimeout(startDevServer, RESTART_DELAY);
      } else {
        log(`Maximum restart attempts (${MAX_RESTARTS}) reached. Please check the logs for errors.`);
        process.exit(1);
      }
    } else {
      log('Next.js process exited cleanly');
    }
  });

  // Handle unexpected errors
  nextProcess.on('error', (err) => {
    log(`Failed to start Next.js process: ${err.message}`);
    process.exit(1);
  });

  // Setup clean exit when this script is terminated
  process.on('SIGINT', () => {
    log('Received SIGINT signal. Shutting down Next.js server...');
    nextProcess.kill('SIGINT');
    setTimeout(() => {
      log('Forcing shutdown...');
      process.exit(0);
    }, 3000);
  });

  process.on('SIGTERM', () => {
    log('Received SIGTERM signal. Shutting down Next.js server...');
    nextProcess.kill('SIGTERM');
    setTimeout(() => {
      log('Forcing shutdown...');
      process.exit(0);
    }, 3000);
  });
}

// Start the server
log('=== Enhanced Next.js Dev Server ===');
log(`Log file: ${LOG_FILE}`);
startDevServer(); 