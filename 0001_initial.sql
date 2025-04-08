// This file contains the database schema and migrations for the bill reminder app

-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS payment_methods;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS user_integrations;

-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settings TEXT -- JSON string for user settings
);

-- Create categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create payment_methods table
CREATE TABLE payment_methods (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'credit', 'bank', 'digital'
  details TEXT NOT NULL, -- JSON string with payment method details
  is_default BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create bills table
CREATE TABLE bills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  due_date DATE NOT NULL,
  category_id TEXT,
  payment_method_id TEXT,
  status TEXT NOT NULL, -- 'paid', 'unpaid', 'pending'
  recurrence TEXT, -- 'one-time', 'weekly', 'monthly', 'yearly'
  recurrence_details TEXT, -- JSON string with recurrence details
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL
);

-- Create documents table
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  bill_id TEXT,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  ocr_processed BOOLEAN DEFAULT 0,
  ocr_data TEXT, -- JSON string with OCR extracted data
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE SET NULL
);

-- Create notifications table
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  bill_id TEXT,
  type TEXT NOT NULL, -- 'due_soon', 'overdue', 'payment_confirmation', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
);

-- Create user_integrations table
CREATE TABLE user_integrations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'email', 'dropbox', 'google_assistant', 'alexa'
  details TEXT NOT NULL, -- JSON string with integration details
  status TEXT NOT NULL, -- 'active', 'inactive', 'pending'
  last_sync TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default categories
INSERT INTO categories (id, user_id, name, color, icon) VALUES
('cat_default_utilities', 'system', 'Utilities', '#3B82F6', 'lightning-bolt'),
('cat_default_housing', 'system', 'Housing', '#10B981', 'home'),
('cat_default_subscriptions', 'system', 'Subscriptions', '#8B5CF6', 'credit-card'),
('cat_default_insurance', 'system', 'Insurance', '#F59E0B', 'shield'),
('cat_default_other', 'system', 'Other', '#6B7280', 'folder');
