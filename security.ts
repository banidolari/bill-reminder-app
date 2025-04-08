import { NextRequest, NextResponse } from 'next/server';
import { D1Database } from '@cloudflare/workers-types';
import * as jose from 'jose';
import * as bcrypt from 'bcryptjs';

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to handle CORS
export function corsMiddleware(request: NextRequest) {
  // Check if it's a preflight request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // For actual requests, we'll add CORS headers in the response
  return null;
}

// Middleware to add security headers
export function securityHeadersMiddleware(response: Response): Response {
  const headers = new Headers(response.headers);
  
  // Add security headers
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'");
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=self, microphone=self, geolocation=self');
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

// Rate limiting middleware
const rateLimits = new Map<string, { count: number, resetTime: number }>();

export function rateLimitMiddleware(request: NextRequest, limit = 100, windowMs = 60000): boolean {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  
  if (!rateLimits.has(ip)) {
    rateLimits.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const userRateLimit = rateLimits.get(ip)!;
  
  // Reset count if the window has passed
  if (now > userRateLimit.resetTime) {
    userRateLimit.count = 1;
    userRateLimit.resetTime = now + windowMs;
    return true;
  }
  
  // Increment count and check if over limit
  userRateLimit.count++;
  if (userRateLimit.count > limit) {
    return false;
  }
  
  return true;
}

// Middleware to validate and sanitize input
export function validateInput(input: any, schema: any): { valid: boolean, errors?: string[] } {
  const errors: string[] = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    // Check required fields
    if (rules.required && (input[field] === undefined || input[field] === null || input[field] === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    // Skip validation if field is not present and not required
    if (input[field] === undefined || input[field] === null) {
      continue;
    }
    
    // Check type
    if (rules.type) {
      const type = typeof input[field];
      if (rules.type === 'array' && !Array.isArray(input[field])) {
        errors.push(`${field} must be an array`);
      } else if (rules.type !== 'array' && type !== rules.type) {
        errors.push(`${field} must be a ${rules.type}`);
      }
    }
    
    // Check min/max for strings and arrays
    if (rules.min !== undefined && (input[field].length < rules.min)) {
      errors.push(`${field} must be at least ${rules.min} characters long`);
    }
    
    if (rules.max !== undefined && (input[field].length > rules.max)) {
      errors.push(`${field} must be at most ${rules.max} characters long`);
    }
    
    // Check pattern
    if (rules.pattern && !rules.pattern.test(input[field])) {
      errors.push(`${field} has an invalid format`);
    }
    
    // Check enum values
    if (rules.enum && !rules.enum.includes(input[field])) {
      errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

// Function to sanitize input to prevent XSS
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Replace potentially dangerous characters
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  } else if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  } else if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// Function to encrypt sensitive data
export async function encryptData(data: string, secret: string): Promise<string> {
  // In a real application, this would use a proper encryption library
  // For this demo, we'll use a simple encryption method
  const encoder = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    secretKey,
    encoder.encode(data)
  );
  
  // Convert ArrayBuffer to Base64
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  // Encode the data
  const encodedData = btoa(data);
  
  return `${encodedData}.${base64Signature}`;
}

// Function to decrypt sensitive data
export async function decryptData(encryptedData: string, secret: string): Promise<string | null> {
  try {
    const [encodedData, signature] = encryptedData.split('.');
    
    // Decode the data
    const data = atob(encodedData);
    
    // Verify the signature
    const encoder = new TextEncoder();
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    // Convert Base64 signature to ArrayBuffer
    const signatureArray = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      secretKey,
      signatureArray,
      encoder.encode(data)
    );
    
    return isValid ? data : null;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

// Function to generate a secure random token
export function generateSecureToken(length = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Function to hash passwords securely
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Function to verify passwords
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Function to generate and sign JWT tokens
export async function generateJWT(payload: any, expiresIn = '24h'): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
  
  return token;
}

// Function to verify JWT tokens
export async function verifyJWT(token: string): Promise<any> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Middleware to check for authentication
export async function authMiddleware(request: NextRequest): Promise<string | null> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const payload = await verifyJWT(token);
    if (!payload || !payload.id) {
      return null;
    }
    
    return payload.id as string;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return null;
  }
}
