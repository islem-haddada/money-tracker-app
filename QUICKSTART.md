# 🚀 QUICK START - Money Tracker App

## ⚡ Get Running in 30 Seconds

### Step 1: Start Backend (Terminal 1)
```bash
cd /home/islem/Desktop/DIV/money-tracker-app
go run main.go
```

**Expected output:**
```
Starting auth server on :8080
```

### Step 2: Start Frontend (Terminal 2)
```bash
cd /home/islem/Desktop/DIV/money-tracker-app
npm start
# Then press 'a' for Android or 'i' for iOS
```

### Step 3: Login with Test Account
```
Email: test@gmail.com
Password: password123
```

**That's it!** ✅

---

## 📱 App Features

### ✅ Working Features
- Authentication (Login/Signup)
- Profile Management
- Transaction Tracking
- History & Statistics
- Notes Management
- Debts Tracking
- Dark Mode
- Settings

### ✅ Recent Fixes
- Token persistence in AsyncStorage
- Loading state handling
- Authentication redirect on app start
- Profile update with token recovery
- Change password with validation
- Better error messages in French

---

## 🧪 Testing Checklist

After login, try these:

- [ ] **Update Profile** - Profile → Modify information
- [ ] **Change Password** - Profile → Change password
- [ ] **Add Transaction** - Home → Click "Ajouter"
- [ ] **View History** - History tab
- [ ] **Check Stats** - Stats tab with charts
- [ ] **Create Notes** - Notes tab → Add note
- [ ] **Dark Mode** - Profile → Toggle dark mode
- [ ] **Restart App** - Close and reopen (token should persist)

---

## 🔧 Debug Mode

### View Detailed Logs
Open browser console or terminal to see:
```
✅ Login success, token: abc123...
✅ Token sauvegardé et state mis à jour
✅ updateProfile: Status 200 OK
✅ updateProfile: User updated: {...}
```

### Test Backend Directly
```bash
# Create user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"User Name"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Update profile
TOKEN="<token_from_login>"
curl -X POST http://localhost:8080/api/auth/update-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"New Name","email":"new@example.com"}'
```

---

## ❌ Troubleshooting

### Problem: "Email ou mot de passe incorrect"
**Solution:** Make sure you used signup first or test@gmail.com exists
```bash
# Create the test account
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"password123","name":"Test"}'
```

### Problem: "Pas de connexion internet"
**Solution:** Make sure backend is running
```bash
# Check backend
curl http://localhost:8080/api/auth/me
# Should return 401 (no token) or user data
```

### Problem: Token shows as "undefined"
**Solution:** Restart app after logging in
- Close app completely
- Reopen app
- Login again
- Token should now be available

### Problem: "App is loading..." stays forever
**Solution:** Restart backend
```bash
pkill -f "go run main.go"
sleep 1
go run main.go &
```

---

## 📊 App Architecture

```
Frontend (React Native/Expo)
├── Authentication (Login/Signup)
├── Main Tabs (7 screens)
│   ├── Home - Dashboard
│   ├── Add - Create transaction
│   ├── History - View transactions
│   ├── Stats - Charts & analytics
│   ├── Debts - Debt tracking
│   ├── Profile - User settings
│   └── Notes - Personal notes
└── Features
    ├── Dark Mode
    ├── Token Persistence
    ├── Profile Management
    └── Multiple Contexts

Backend (Go + SQLite)
├── Authentication
│   ├── Signup
│   ├── Login
│   ├── Update Profile
│   ├── Change Password
│   └── Delete Account
└── Database
    └── Users Table
```

---

## 🎨 Customization

### Change API URL
Edit `context/AuthContext.tsx`:
```tsx
const API_URL = "http://localhost:8080"; // ← Change here
```

### Change JWT Secret
Edit `main.go`:
```go
var jwtKey = []byte("your-super-secret-jwt-key-change-this-in-production");
```

### Change App Colors
Edit `constants/theme.ts`:
```ts
export const Colors = {
  light: {
    primary: "#4CAF50", // ← Main green color
    ...
  },
  ...
}
```

---

## 📞 Getting Help

### Check Logs
1. Frontend: Check browser/terminal console
2. Backend: Check terminal output
3. AsyncStorage: Data persisted locally

### Common Issues & Solutions
See `DEBUG_AUTH.md` for detailed debugging guide

### File Locations
- Backend: `main.go`
- Frontend: `app/`, `screens/`, `context/`
- Config: `firebaseConfig.ts`, `constants/theme.ts`

---

## ✨ What's Next?

After confirming everything works:

1. **Add Categories** to transactions
2. **Create Budget** management
3. **Add Recurring** transactions
4. **Enable** push notifications
5. **Implement** data export/import

---

**Happy tracking!** 💰📊

Last Updated: 8 février 2026
