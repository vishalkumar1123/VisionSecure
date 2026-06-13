# Quick Reference - User Authentication System

## 🚀 Quick Start

### 1. Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "password": "SecurePass@123",
    "confirmPassword": "SecurePass@123"
  }'
```

### 2. Verify Email
```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"token": "verification_token_from_email"}'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/[...nextauth]/callback/credentials \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

---

## 📊 API Endpoints

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/verify-email` | ❌ | Verify email with token |
| POST | `/api/auth/forgot-password` | ❌ | Request password reset |
| POST | `/api/auth/reset-password` | ❌ | Reset password with token |
| POST | `/api/auth/change-password` | ✅ | Change password (logged in user) |
| GET | `/api/users` | ✅ | List all users |
| POST | `/api/users` | ✅ | Create new user (admin) |
| GET | `/api/users/[id]` | ✅ | Get user details |
| PATCH | `/api/users/[id]` | ✅ | Update user |
| DELETE | `/api/users/[id]` | ✅ | Deactivate user |

---

## 🔐 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **super_admin** | All permissions |
| **admin** | Create, read, update users; manage leads |
| **sales_executive** | Create leads, manage own leads |
| **technician** | View assigned leads, update status |
| **viewer** | Read-only access |

---

## 📝 User Schema Fields

```typescript
{
  _id: "mongodb_id",
  name: "John Doe",
  email: "john@example.com",          // unique, lowercase
  mobile: "9876543210",               // unique, 10 digits
  password: "hashed_password",        // select: false
  role: "sales_executive",
  permissions: ["lead.create", ...],
  isActive: true,
  emailVerified: true,
  profilePicture: "url",
  lastLoginAt: "2026-06-02T00:23:50Z",
  departmentId: "dept_id",
  reportingTo: "manager_id",
  createdAt: "2026-06-02T00:23:50Z",
  updatedAt: "2026-06-02T00:23:50Z"
}
```

---

## ✅ All Fixes Applied

| # | Issue | Status | Impact |
|---|-------|--------|--------|
| 1 | Middleware export deprecated | ✅ FIXED | Build now passes |
| 2 | Password not selected in login | ✅ FIXED | Users can now login |
| 3 | Email verification missing data | ✅ FIXED | Complete user data returned |
| 4 | Type definition incomplete | ✅ FIXED | Type safety restored |
| 5 | User DTO mapping broken | ✅ FIXED | User lists work correctly |
| 6 | useSearchParams without Suspense | ✅ FIXED | Pages render without errors |

---

## 🧪 Testing the System

### Setup
1. Start MongoDB: `mongod`
2. Start dev server: `npm run dev`
3. Open http://localhost:3001

### Test Flow
1. **Register**: Go to `/register`
2. **Verify**: Get token from console → Go to `/verify-email?token=XXX`
3. **Login**: Go to `/admin/login`
4. **Use**: Access protected dashboard → `/admin/dashboard`

---

## 🔍 Debugging

### Check Database Connection
```javascript
// In any API endpoint:
await connectDB()  // Will log "✅ MongoDB Connected"
```

### Check User Creation
```bash
# MongoDB shell
use visionsecure
db.users.findOne({ email: "test@example.com" })
```

### Check JWT Token
```javascript
// In browser console after login:
// Token stored in NextAuth session
const session = await getSession()
console.log(session.user)
```

### Enable Debug Logging
```typescript
// In lib/auth.ts - enable console logging
console.log("AUTH ERROR:", error)
```

---

## 📋 Password Requirements

- **Minimum Length:** 8 characters
- **Uppercase:** At least 1 letter (A-Z)
- **Lowercase:** At least 1 letter (a-z)
- **Numbers:** At least 1 digit (0-9)
- **Special:** At least 1 character (!@#$%^&*)

**Example Valid Passwords:**
- `SecurePass@123`
- `Password!2024`
- `MyP@ssw0rd`

---

## 🚨 Common Issues & Fixes

### "Invalid password" on login
→ Check `.select("+password")` in `lib/auth.ts`

### "Invalid or expired verification token"
→ Check token exists and hasn't been deleted
→ Verify 24-hour expiration hasn't passed

### "Email already exists"
→ Use different email or reset database

### Build error with useSearchParams
→ Wrap with `<Suspense>` boundary

### "Unauthorized" on protected routes
→ Check authentication token is valid
→ Verify NEXTAUTH_SECRET is set

---

## 📚 Key Files

```
├── services/
│   ├── auth-service.ts      ← Registration, verification, password reset
│   └── user-service.ts      ← User CRUD operations
├── lib/
│   ├── auth.ts              ← NextAuth configuration & JWT logic
│   ├── mongodb.ts           ← Database connection
│   └── validation-auth.ts   ← Input validation schemas
├── models/
│   ├── User.ts              ← User schema
│   ├── VerificationToken.ts ← Email verification token schema
│   └── PasswordReset.ts     ← Password reset token schema
├── app/api/auth/
│   ├── register/            ← User registration
│   ├── verify-email/        ← Email verification
│   ├── forgot-password/    ← Password reset request
│   └── reset-password/      ← Password reset completion
└── app/api/users/
    ├── route.ts             ← List & create users
    └── [id]/                ← Get, update, delete user
```

---

## 🔧 Environment Variables

Required in `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/visionsecure

# NextAuth
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Optional: Email Configuration
EMAIL_FROM_ADDRESS=noreply@visionsecuretech.in
EMAIL_REPLY_TO=info@visionsecuretech.in
```

---

## 📞 Support

### Documentation Files
- `FIXES_SUMMARY.md` - Detailed fix explanations
- `AUTHENTICATION_GUIDE.md` - Complete architecture guide

### Build & Deploy
```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Type check
npm run type-check

# Lint
npm run lint
```

---

**Status:** ✅ ALL FIXED & TESTED
**Last Updated:** 2026-06-02
**Ready for:** Production Deployment
