import { NextRequest } from 'next/server';
import * as jose from 'jose';

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token and extract user ID
export async function verifyAuth(request: NextRequest): Promise<string | null> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Return user ID from payload
    return payload.id as string;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}
