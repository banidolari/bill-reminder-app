# Bill Reminder Application Architecture (Updated)

## System Architecture

The Bill Reminder Application will follow a modern web application architecture with the following components:

### Frontend
- **Web Application**: A responsive web application built with Next.js that works across desktop and mobile browsers
- **Progressive Web App (PWA)**: Enabling offline capabilities and mobile-like experience
- **Media Capture**: Camera integration for bill scanning and photo capture

### Backend
- **API Layer**: RESTful API endpoints for data operations
- **Authentication Service**: Handling user registration, login, and session management
- **Notification Service**: Managing and sending bill reminders and notifications
- **Document Processing Service**: Handling bill image storage and OCR processing
- **External Integration Service**: Managing connections to email and Dropbox
- **Database**: Storing user data, bills, categories, and notification preferences

### Infrastructure
- **Hosting**: Cloudflare Pages for frontend hosting
- **Serverless Functions**: Cloudflare Workers for backend logic
- **Database**: Cloudflare D1 (SQLite-compatible) for data storage
- **Caching**: Cloudflare KV for caching frequently accessed data
- **File Storage**: Cloudflare R2 for storing bill images and documents

## Technology Stack

### Frontend
- **Framework**: Next.js (React-based framework)
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API and hooks
- **UI Components**: Custom components with Tailwind
- **Data Fetching**: SWR for efficient data fetching and caching
- **Authentication**: JWT-based authentication
- **Media Capture**: Web API MediaDevices for camera access
- **File Handling**: File API for document uploads and processing

### Backend
- **Runtime**: Cloudflare Workers (serverless)
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Storage**: Cloudflare R2 for object storage
- **API**: RESTful API endpoints
- **Authentication**: JWT tokens
- **Email Service**: Integration with email service provider for notifications
- **OCR Processing**: Integration with OCR service for bill data extraction
- **External APIs**: Email (IMAP/POP3) and Dropbox API integrations

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bills Table
```sql
CREATE TABLE bills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount REAL NOT NULL,
  due_date DATE NOT NULL,
  category_id TEXT,
  status TEXT CHECK(status IN ('paid', 'unpaid', 'overdue')) DEFAULT 'unpaid',
  recurrence TEXT CHECK(recurrence IN ('none', 'daily', 'weekly', 'monthly', 'quarterly', 'annually')) DEFAULT 'none',
  payment_method TEXT,
  notes TEXT,
  has_document BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'tag',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  bill_id TEXT NOT NULL,
  type TEXT CHECK(type IN ('email', 'in-app', 'both')) DEFAULT 'in-app',
  days_before INTEGER DEFAULT 3,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
);
```

### Notification_Logs Table
```sql
CREATE TABLE notification_logs (
  id TEXT PRIMARY KEY,
  notification_id TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT CHECK(status IN ('sent', 'failed')) DEFAULT 'sent',
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
);
```

### Bill_Documents Table
```sql
CREATE TABLE bill_documents (
  id TEXT PRIMARY KEY,
  bill_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  ocr_processed BOOLEAN DEFAULT false,
  ocr_data TEXT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Connected_Services Table
```sql
CREATE TABLE connected_services (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  service_type TEXT CHECK(service_type IN ('email', 'dropbox')) NOT NULL,
  service_identifier TEXT NOT NULL, -- email address or account ID
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMP,
  last_scan_date TIMESTAMP,
  status TEXT CHECK(status IN ('active', 'expired', 'revoked', 'error')) DEFAULT 'active',
  settings TEXT, -- JSON string with service-specific settings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, service_type, service_identifier)
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/password-reset` - Request password reset

### Bills
- `GET /api/bills` - Get all bills for current user
- `GET /api/bills/:id` - Get specific bill
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill
- `PATCH /api/bills/:id/status` - Update bill status (paid/unpaid)

### Categories
- `GET /api/categories` - Get all categories for current user
- `GET /api/categories/:id` - Get specific category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Notifications
- `GET /api/notifications` - Get all notification settings
- `POST /api/notifications` - Create notification setting
- `PUT /api/notifications/:id` - Update notification setting
- `DELETE /api/notifications/:id` - Delete notification setting

### Dashboard
- `GET /api/dashboard/summary` - Get summary statistics
- `GET /api/dashboard/upcoming` - Get upcoming bills
- `GET /api/dashboard/overdue` - Get overdue bills

### Documents
- `GET /api/documents` - Get all documents for current user
- `GET /api/documents/:id` - Get specific document
- `GET /api/bills/:id/documents` - Get all documents for a bill
- `POST /api/bills/:id/documents` - Upload document for a bill
- `DELETE /api/documents/:id` - Delete document
- `POST /api/documents/:id/ocr` - Process document with OCR

### Connected Services
- `GET /api/services` - Get all connected services for current user
- `POST /api/services/email` - Connect email account
- `POST /api/services/dropbox` - Connect Dropbox account
- `DELETE /api/services/:id` - Disconnect service
- `POST /api/services/:id/scan` - Manually trigger scan for bills
- `GET /api/services/:id/status` - Check service connection status

## Authentication Flow

1. User registers or logs in
2. Server validates credentials and issues JWT token
3. Client stores token in localStorage/cookies
4. Token is included in Authorization header for authenticated requests
5. Server validates token for protected endpoints
6. Token expires after set period, requiring re-authentication

## Bill Scanning and OCR Flow

1. User captures image via camera or uploads file
2. Frontend sends image to backend
3. Backend stores image in R2 storage
4. Backend sends image to OCR service for processing
5. OCR service extracts bill details (amount, due date, etc.)
6. Backend stores extracted data and associates with bill
7. User reviews and confirms or edits extracted data

## External Service Integration Flow

### Email Integration
1. User provides email credentials or authorizes via OAuth
2. Backend securely stores credentials/tokens
3. Scheduled worker scans email inbox for bill-related messages
4. Worker identifies bills using pattern matching and NLP
5. Worker extracts bill details and creates bill entries
6. User receives notification of new bills found

### Dropbox Integration
1. User authorizes application via OAuth
2. Backend securely stores access/refresh tokens
3. Scheduled worker scans specified Dropbox folders
4. Worker identifies bill documents based on file type and content
5. Worker downloads documents, stores in R2, and processes with OCR
6. Worker creates bill entries with extracted data
7. User receives notification of new bills found

## Security Considerations

- HTTPS for all communications
- JWT tokens with appropriate expiration
- Password hashing using bcrypt
- CSRF protection
- Input validation and sanitization
- Rate limiting for API endpoints
- Data encryption for sensitive information
- Secure storage of third-party service credentials
- OAuth for third-party service authentication

## Scalability Considerations

- Stateless architecture for horizontal scaling
- Efficient database indexing
- Caching strategy for frequently accessed data
- Optimized API responses with pagination
- Lazy loading of UI components
- Efficient image processing and storage
- Background processing for OCR and email/Dropbox scanning
