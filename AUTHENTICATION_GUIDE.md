# Complete Authentication & User Management Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  (Register → Verify Email → Login → Dashboard)              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ↓                         ↓
┌─────────────────┐      ┌──────────────────┐
│  Auth Routes    │      │  User Routes     │
│  /api/auth/*    │      │  /api/users/*    │
└────────┬────────┘      └────────┬─────────┘
         │                        │
         └────────────┬───────────┘
                      ↓
         ┌────────────────────────┐
         │  Authentication Layer  │
         │  - NextAuth.js (JWT)   │
         │  - Credentials Provider│
         │  - Session Management  │
         └────────────┬───────────┘
                      ↓
         ┌────────────────────────┐
         │   Service Layer        │
         │  - AuthService         │
         │  - UserService         │
         └────────────┬───────────┘
                      ↓
         ┌────────────────────────┐
         │   Data Layer           │
         │  - MongoDB Models      │
         │  - Mongoose Schema     │
         └────────────┬───────────┘
                      ↓
         ┌────────────────────────┐
         │    MongoDB Database    │
         │  - Users               │
         │  - VerificationTokens  │
         │  - PasswordResets      │
         └────────────────────────┘
```

---

## User Registration Flow

### Step 1: Frontend → Register
```typescript
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "SecurePassword@123",
  "confirmPassword": "SecurePassword@123"
}
```

### Step 2: Validation
- ✅ Name: 2+ characters
- ✅ Email: Valid email format
- ✅ Mobile: Exactly 10 digits
- ✅ Password: 8+ chars with uppercase, lowercase, numbers, special chars
- ✅ Unique email and mobile in database

### Step 3: User Creation
```typescript
// AuthService.register() flow:
1. Check if email/mobile already exists
2. Hash password with bcryptjs (10 rounds)
3. Create user document in database
4. Generate verification token
5. Return user data + verification token
```

### Step 4: Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_mongodb_id",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210"
    },
    "message": "Registration successful. Please verify your email.",
    "verificationTokenUrl": "/auth/verify-email/token_here"
  }
}
```

---

## Email Verification Flow

### Step 1: User Receives Token
Token sent via email (currently outputs to console in dev mode)

### Step 2: Frontend Sends Token
```typescript
POST /api/auth/verify-email
{
  "token": "verification_token_here"
}
```

### Step 3: Backend Verification
```typescript
// AuthService.verifyEmail() flow:
1. Find verification token in database
2. Check if token hasn't expired (24 hours)
3. Update user document: emailVerified = true
4. Delete verification token
5. Return user data with emailVerified: true
```

### Step 4: Success Response
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "id": "user_mongodb_id",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "sales_executive",
    "isActive": true,
    "emailVerified": true
  }
}
```

---

## User Login Flow

### Step 1: Frontend Sends Credentials
```typescript
POST /api/auth/[...nextauth] (NextAuth signin)
{
  "email": "john@example.com",
  "password": "SecurePassword@123"
}
```

### Step 2: NextAuth Credentials Provider
```typescript
// lib/auth.ts - authorize() callback:
1. Validate email and password provided
2. Find user by email in database
3. ⚠️ CRITICAL: Select password field (.select("+password"))
4. Check if user is active (isActive = true)
5. Compare provided password with hashed password (bcryptjs)
6. Return user data if valid
```

**Important:** Password field must be explicitly selected because User schema has `select: false`

### Step 3: JWT Token Generation
```typescript
// lib/auth.ts - jwt() callback:
1. Add user.id to token
2. Add user.role to token
3. Return enhanced token
```

### Step 4: Session Enrichment
```typescript
// lib/auth.ts - session() callback:
1. Add token.id to session.user
2. Add token.role to session.user
3. Return enhanced session
```

### Step 5: Frontend Receives Session
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "id": "user_mongodb_id",
    "role": "sales_executive"
  },
  "expires": "2026-06-09T00:23:50.689Z"
}
```

---

## User Management (CRUD Operations)

### GET /api/users - List All Users
**Requirements:** Authenticated + `user.read` permission

```typescript
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10, max: 100)
- search: string (searches name, email, mobile)
- role: string (filter by role)
- isActive: boolean (filter by active status)
```

**Response:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "data": [
      {
        "id": "mongodb_id",
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "9876543210",
        "role": "sales_executive",
        "isActive": true,
        "emailVerified": true,
        "createdAt": "2026-06-02T00:23:50.689Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

### GET /api/users/[id] - Get Single User
**Requirements:** Authenticated + `user.read` permission

```typescript
Response:
{
  "success": true,
  "message": "User fetched successfully",
  "data": { /* user object */ }
}
```

### POST /api/users - Create User (Admin)
**Requirements:** Authenticated + `user.create` permission

```typescript
Request:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "mobile": "9876543211",
  "password": "SecurePassword@123",
  "role": "sales_executive"
}

Response: 201 Created with user data
```

### PATCH /api/users/[id] - Update User
**Requirements:** Authenticated + `user.update` permission

```typescript
Request: (all fields optional)
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "mobile": "9876543212",
  "role": "admin",
  "isActive": true
}

Response: 200 OK with updated user data
```

### DELETE /api/users/[id] - Deactivate User (Soft Delete)
**Requirements:** Authenticated + `user.delete` permission

```typescript
Response: 200 OK with deactivated user (isActive: false)
```

---

## Password Reset Flow

### Step 1: Request Password Reset
```typescript
POST /api/auth/forgot-password
{
  "email": "john@example.com"
}
```

### Step 2: Backend Processing
```typescript
// AuthService.requestPasswordReset() flow:
1. Find user by email
2. Generate reset token (valid for 1 hour)
3. Store token in PasswordReset collection
4. Send reset link via email
```

### Step 3: User Clicks Reset Link
- Frontend receives token in URL
- Displays reset password form

### Step 4: Submit New Password
```typescript
POST /api/auth/reset-password
{
  "token": "reset_token_here",
  "password": "NewPassword@123",
  "confirmPassword": "NewPassword@123"
}
```

### Step 5: Backend Verification & Update
```typescript
// AuthService.resetPassword() flow:
1. Find reset token
2. Verify token hasn't expired (1 hour)
3. Hash new password
4. Update user password
5. Delete reset token
6. Return success with user data
```

---

## Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  name: String,                    // Required, 2+ chars
  email: String,                   // Required, unique, lowercase
  mobile: String,                  // Required, unique, 10 digits
  password: String,                // Required, hashed, select: false
  role: String,                    // sales_executive, admin, etc.
  permissions: [String],           // Derived from role
  isActive: Boolean,               // Default: true, indexed
  emailVerified: Boolean,          // Default: false
  profilePicture: String,          // Optional
  lastLoginAt: Date,               // Optional
  departmentId: ObjectId,          // Reference to Department
  reportingTo: ObjectId,           // Reference to User (manager)
  createdAt: Date,                 // Timestamp
  updatedAt: Date                  // Timestamp
}
```

### VerificationToken Collection
```typescript
{
  _id: ObjectId,
  email: String,                   // Required
  token: String,                   // Required, unique
  expiresAt: Date,                 // TTL: 24 hours, expires: 86400
  isVerified: Boolean,             // Default: false
  createdAt: Date,
  updatedAt: Date
}
```

### PasswordReset Collection
```typescript
{
  _id: ObjectId,
  email: String,                   // Required
  token: String,                   // Required, unique
  expiresAt: Date,                 // TTL: 1 hour, expires: 3600
  createdAt: Date,
  updatedAt: Date
}
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request (Validation)
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "email": ["Invalid email address"],
    "password": ["Password must be at least 8 characters"]
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

#### 403 Forbidden
```json
{
  "success": false,
  "error": "Forbidden"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "User not found"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Best Practices

### 1. Password Security
- ✅ Always hash passwords with bcryptjs (10+ rounds)
- ✅ Never store plain text passwords
- ✅ Never return passwords in API responses
- ✅ Enforce strong password requirements

### 2. Session Management
- ✅ Use JWT tokens with expiration
- ✅ Validate token on every protected request
- ✅ Refresh tokens before expiration
- ✅ Clear tokens on logout

### 3. Email Verification
- ✅ Generate unique tokens for each verification
- ✅ Set short expiration times (24 hours)
- ✅ Delete tokens after use
- ✅ Auto-delete expired tokens with TTL index

### 4. User Data
- ✅ Exclude sensitive fields (password, permissions) from responses
- ✅ Use DTOs to control response structure
- ✅ Validate all input before processing
- ✅ Sanitize data before storage

### 5. Role-Based Access Control
- ✅ Check permissions on every protected endpoint
- ✅ Assign permissions based on user role
- ✅ Update role to change permissions
- ✅ Log permission changes for audit

---

## Troubleshooting

### Users Can't Login
**Problem:** Login fails with "Invalid password"
**Solution:**
1. Check password field is selected: `.select("+password")`
2. Verify password is hashed before storage
3. Check bcryptjs comparison: `bcrypt.compare(plain, hashed)`
4. Confirm user exists with correct email

### Email Verification Fails
**Problem:** "Invalid or expired verification token"
**Solution:**
1. Check token exists in VerificationToken collection
2. Verify token hasn't expired (24 hours)
3. Check email matches user record
4. Ensure token was generated correctly

### User Data Incomplete
**Problem:** Missing fields in user response
**Solution:**
1. Check DTO mapping includes all required fields
2. Verify database document has the fields
3. Check `.select()` excludes correct fields
4. Ensure null values are handled properly

### Permission Denied
**Problem:** "Forbidden" error on protected endpoints
**Solution:**
1. Check user has required permission
2. Verify role matches permission mapping
3. Check JWT token includes role
4. Confirm token is valid and not expired

---

## Testing Checklist

- [ ] User can register with valid data
- [ ] User cannot register with duplicate email
- [ ] User cannot register with invalid email format
- [ ] User receives verification token after registration
- [ ] User can verify email with correct token
- [ ] User cannot verify with invalid/expired token
- [ ] User can login after email verification
- [ ] User cannot login with wrong password
- [ ] User cannot login with unverified email (optional)
- [ ] Admin can create users
- [ ] Admin can list all users
- [ ] Admin can update user data
- [ ] Admin can deactivate users
- [ ] Users cannot access admin endpoints
- [ ] Password reset token expires after 1 hour
- [ ] Verified email token expires after 24 hours

---

**Last Updated:** 2026-06-02
**Version:** 1.0 - Complete
