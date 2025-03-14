import { NextResponse } from 'next/server';

/**
 * Standardized API error response
 * @param message Error message to display to the user
 * @param status HTTP status code
 * @param error Original error object (optional)
 * @returns NextResponse with error details
 */
export function apiError(message: string, status: number = 500, error?: any) {
  // Log errors in production/development, but not in tests
  if (process.env.NODE_ENV !== 'test') {
    console.error(`API Error [${status}]:`, message, error || '');
  }
  
  // Create standardized error response
  return NextResponse.json(
    { 
      error: message,
      status,
      success: false,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

/**
 * Custom error classes for different API error scenarios
 */

// Authentication errors (401)
export class AuthenticationError extends Error {
  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Authorization errors (403)
export class AuthorizationError extends Error {
  constructor(message = 'You do not have permission to perform this action') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// Validation errors (400)
export class ValidationError extends Error {
  constructor(message = 'Invalid input data') {
    super(message);
    this.name = 'ValidationError';
  }
}

// Not found errors (404)
export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Rate limit errors (429)
export class RateLimitError extends Error {
  constructor(message = 'Too many requests, please try again later') {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Global API error handler for try/catch blocks
 * @param error The caught error
 * @returns NextResponse with appropriate error details
 */
export function handleApiError(error: any) {
  // Handle known error types
  if (error instanceof AuthenticationError) {
    return apiError(error.message, 401, error);
  }
  if (error instanceof AuthorizationError) {
    return apiError(error.message, 403, error);
  }
  if (error instanceof ValidationError) {
    return apiError(error.message, 400, error);
  }
  if (error instanceof NotFoundError) {
    return apiError(error.message, 404, error);
  }
  if (error instanceof RateLimitError) {
    return apiError(error.message, 429, error);
  }
  
  // Handle Mongoose/MongoDB errors
  if (error.name === 'MongoServerError') {
    if (error.code === 11000) {
      return apiError('Duplicate entry', 409, error);
    }
  }

  // Handle network or connection errors
  if (error.name === 'ConnectionError' || error.name === 'NetworkError') {
    return apiError('Database connection error, please try again later', 503, error);
  }
  
  // Handle unexpected errors
  console.error('Unhandled API error:', error);
  return apiError(
    'An unexpected error occurred. Our team has been notified.',
    500,
    error
  );
} 