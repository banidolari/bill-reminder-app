import { NextRequest, NextResponse } from 'next/server';
import { D1Database } from '@cloudflare/workers-types';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import * as jose from 'jose';

// Secret key for JWT signing
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to generate JWT token
async function generateToken(user: any) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new jose.SignJWT({ 
    id: user.id,
    email: user.email,
    name: user.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  
  return token;
}

// Register a new user
export async function register(
  request: NextRequest,
  env: { DB: D1Database }
) {
  try {
    const { email, name, password } = await request.json();

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    )
      .bind(email)
      .first();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate user ID
    const userId = uuidv4();

    // Insert user into database
    await env.DB.prepare(
      'INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)'
    )
      .bind(userId, email, name, hashedPassword)
      .run();

    // Insert default categories for the user
    const defaultCategories = [
      { name: 'Utilities', color: '#3B82F6', icon: 'lightning-bolt' },
      { name: 'Housing', color: '#10B981', icon: 'home' },
      { name: 'Subscriptions', color: '#8B5CF6', icon: 'credit-card' },
      { name: 'Insurance', color: '#F59E0B', icon: 'shield' },
      { name: 'Other', color: '#6B7280', icon: 'folder' }
    ];

    for (const category of defaultCategories) {
      await env.DB.prepare(
        'INSERT INTO categories (id, user_id, name, color, icon) VALUES (?, ?, ?, ?, ?)'
      )
        .bind(uuidv4(), userId, category.name, category.color, category.icon)
        .run();
    }

    // Generate JWT token
    const user = { id: userId, email, name };
    const token = await generateToken(user);

    return NextResponse.json({ 
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

// Login user
export async function login(
  request: NextRequest,
  env: { DB: D1Database }
) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    )
      .bind(email)
      .first();

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      id: user.id,
      email: user.email,
      name: user.name
    });

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

// Get current user
export async function getCurrentUser(
  request: NextRequest,
  env: { DB: D1Database }
) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Get user from database
    const user = await env.DB.prepare(
      'SELECT id, email, name, created_at, updated_at, settings FROM users WHERE id = ?'
    )
      .bind(payload.id)
      .first();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

// Update user profile
export async function updateProfile(
  request: NextRequest,
  env: { DB: D1Database }
) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Get request body
    const { name, settings } = await request.json();
    
    // Update user in database
    await env.DB.prepare(
      'UPDATE users SET name = ?, settings = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(name, JSON.stringify(settings), payload.id)
      .run();

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: {
        id: payload.id,
        name,
        settings
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating profile' },
      { status: 500 }
    );
  }
}

// Change password
export async function changePassword(
  request: NextRequest,
  env: { DB: D1Database }
) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Get request body
    const { currentPassword, newPassword } = await request.json();
    
    // Get user from database
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE id = ?'
    )
      .bind(payload.id)
      .first();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    await env.DB.prepare(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(hashedPassword, payload.id)
      .run();

    return NextResponse.json({ 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while changing password' },
      { status: 500 }
    );
  }
}
