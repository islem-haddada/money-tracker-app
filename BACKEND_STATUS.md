# 📋 Test Account & Backend Status

## 🎯 Test Account Details

```
Email:    test@gmail.com
Password: password123
Name:     Test User
```

**Status:** ✅ Created and working

---

## 🔧 Backend Status

### Running Server
```bash
go run main.go
# Output: Starting auth server on :8080
```

### API Endpoints (Tested & Working)

#### 1. Signup
```
POST /api/auth/signup
{
  "email": "test@gmail.com",
  "password": "password123",
  "name": "Test User"
}
✅ Response: {"token":"...", "user":{...}}
```

#### 2. Login
```
POST /api/auth/login
{
  "email": "test@gmail.com",
  "password": "password123"
}
✅ Response: {"token":"...", "user":{...}}
```

#### 3. Update Profile
```
POST /api/auth/update-profile
Headers: Authorization: Bearer <token>
{
  "name": "New Name",
  "email": "newemail@gmail.com"
}
✅ Response: {"user":{"email":"...","name":"..."}}
```

#### 4. Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
✅ Response: {"user":{"id":1,"email":"test@gmail.com","name":"Test User"}}
```

#### 5. Change Password
```
POST /api/auth/change-password
Headers: Authorization: Bearer <token>
{
  "old_password": "password123",
  "new_password": "newpassword123"
}
✅ Response: {"message":"success"}
```

#### 6. Delete Account
```
DELETE /api/auth/delete-account
Headers: Authorization: Bearer <token>
✅ Response: {"message":"account deleted"}
```

---

## 🧪 Backend Test Commands

### Quick Test All Endpoints
```bash
#!/bin/bash

# 1. Signup
echo "1. Creating user..."
SIGNUP=$(curl -s -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"password123","name":"Test User"}')
echo $SIGNUP

# 2. Login
echo -e "\n2. Logging in..."
LOGIN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"password123"}')
echo $LOGIN
TOKEN=$(echo $LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 3. Get Current User
echo -e "\n3. Getting current user..."
curl -s -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 4. Update Profile
echo -e "\n4. Updating profile..."
curl -s -X POST http://localhost:8080/api/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Updated Name","email":"updated@gmail.com"}'

# 5. Change Password
echo -e "\n5. Changing password..."
curl -s -X POST http://localhost:8080/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"old_password":"password123","new_password":"newpass123"}'
```

### Individual Endpoint Tests

**Test Signup:**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@gmail.com","password":"pass123","name":"New User"}'
```

**Test Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"password123"}'
```

**Test with Token:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X POST http://localhost:8080/api/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Test","email":"test@gmail.com"}'
```

---

## 📊 Database Status

### SQLite Database
- **Location:** `./moneytracker.db`
- **Table:** `users`
- **Current User Count:** 1 (test@gmail.com)

### Database Schema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Quick Setup Checklist

- [x] Backend running: `go run main.go`
- [x] Test account created: test@gmail.com
- [x] Login working: Returns token
- [x] Profile update working: Updates email/name
- [x] Token generation working: 7-day expiry
- [x] Password validation: Min 6 chars
- [x] Email validation: Regex pattern
- [x] CORS enabled: All origins accepted
- [x] Error messages: Clear and in French

---

## 🔄 Reset Database

If you need to reset everything:

```bash
# Stop backend
pkill -f "go run main.go"

# Remove database
rm ./moneytracker.db

# Restart backend (creates new database)
go run main.go &

# Recreate test user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"password123","name":"Test User"}'
```

---

## 📱 Frontend Configuration

**API Endpoint:**
- `context/AuthContext.tsx` line 26: `const API_URL = "http://localhost:8080"`

**Token Storage:**
- Key: `auth_token`
- Location: AsyncStorage (device storage)
- Persistence: Yes (survives app restart)

---

## ✅ Everything Ready

✅ Backend server running on port 8080  
✅ Test account created and verified  
✅ All endpoints tested and working  
✅ Database initialized  
✅ Frontend properly configured  
✅ Token persistence working  
✅ Error handling in place  

**Ready to test the app!** 🎉

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Email ou mot de passe incorrect" | Create test account with signup |
| "Cannot connect to server" | Make sure `go run main.go` is running |
| "Network request failed" | Check if backend is listening on :8080 |
| Token not persisting | Restart app after login |
| Blank response from API | Check if backend is still running |

---

**Last Updated:** 8 février 2026  
**Backend:** ✅ Running and tested  
**Test Account:** ✅ Created and verified  
**Status:** ✅ READY
