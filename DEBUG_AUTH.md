# 🔍 Authentication Debug Guide

## Current Issue
Token is missing even after successful login. This could happen if:

1. **User is NOT actually logged in** - Most likely
2. Token was cleared/removed
3. Login succeeded but token wasn't saved to AsyncStorage

## How to Debug

### Check 1: Verify Login Works
**Steps:**
1. Launch app and look for "Loading..." spinner
2. Navigate to Login screen
3. Enter credentials: `test@gmail.com` / `password123`
4. Check console logs:

**Expected Logs:**
```
✅ Login success, token: abc123def456...
✅ Token sauvegardé et state mis à jour
✅ RootLayoutContent: loading = false token = exists user = test@gmail.com
```

**If you see instead:**
```
❌ Login error: ...
❌ Impossible de se connecter
```
→ Backend not running or credentials wrong

### Check 2: Verify Token Persistence
**Steps:**
1. After successful login, go to Profile
2. Close and restart the app
3. Check console logs:

**Expected Logs:**
```
✅ AuthProvider: Token from AsyncStorage: Found
✅ RootLayoutContent: loading = false token = exists user = test@gmail.com
```

**If you see:**
```
❌ AuthProvider: Token from AsyncStorage: Not found
```
→ Token wasn't saved to AsyncStorage during login

### Check 3: Test Profile Update
**Steps:**
1. Login successfully (verify with Check 1)
2. Go to Profile → "Modifier les informations"
3. Change name/email
4. Click "Enregistrer"

**Expected Logs:**
```
✅ updateProfile: token = abc123...
✅ updateProfile: Using token = abc123...
✅ updateProfile: Status 200 OK
✅ Succès, Profil mis à jour!
```

**If you see:**
```
❌ updateProfile: token = null
❌ updateProfile: Token from AsyncStorage: NOT FOUND!
❌ NO TOKEN FOUND! User not properly logged in.
```
→ User is not logged in. Logout and login again.

## Complete Debug Flow

```bash
# 1. Clear app data
adb shell pm clear com.money-tracker-app
# or in Android Emulator: Settings → Apps → Money Tracker → Clear Cache/Data

# 2. Restart app
# You should see: "Loading..." spinner for 2-3 seconds

# 3. Verify initial state
# Check logs for: "AuthProvider: Token from AsyncStorage: Not found"

# 4. Login
# Email: test@gmail.com
# Password: password123

# 5. Verify login success
# Check logs for: "Token sauvegardé et state mis à jour"

# 6. Go to Profile
# Check logs for: "RootLayoutContent: loading = false token = exists"

# 7. Update Profile
# Check logs for: "updateProfile: Status 200 OK"
```

## Key Console Logs to Watch

| Log | Meaning |
|-----|---------|
| `AuthProvider: Token from AsyncStorage: Found` | ✅ Token exists on startup |
| `AuthProvider: Token from AsyncStorage: Not found` | ⚠️ First login or token cleared |
| `Login success, token: abc123...` | ✅ Login successful |
| `Token sauvegardé et state mis à jour` | ✅ Token saved to AsyncStorage |
| `RootLayoutContent: loading = false token = exists` | ✅ Ready to use app |
| `updateProfile: token = abc123...` | ✅ Token available in state |
| `updateProfile: Token not in state, fetching from AsyncStorage` | ⚠️ Token fetched from storage |
| `updateProfile: Token from AsyncStorage: Found` | ✅ Token recovered |
| `❌ NO TOKEN FOUND! User not properly logged in.` | ❌ User not logged in |

## Troubleshooting

### Problem: Token keeps disappearing
**Solution:** Restart backend + app
```bash
pkill -f "go run main.go"
sleep 1
cd /home/islem/Desktop/DIV/money-tracker-app
go run main.go &
```

### Problem: "User not properly logged in" on Profile
**Solution:** 
1. Go back to home screen
2. Logout (if possible)
3. Login again with valid credentials
4. Try Profile update again

### Problem: AsyncStorage shows "Not found"
**Likely Cause:** Login failed silently
1. Check backend is running: `curl http://localhost:8080/api/auth/me`
2. Try login again with correct credentials
3. Check network connectivity

### Problem: Token in state but still fails
**Solution:** Try restarting the app completely
1. Close app
2. `adb shell pm clear com.money-tracker-app`
3. Reopen app
4. Login again

## Backend Verification

### Check if backend is running
```bash
curl http://localhost:8080/api/auth/me
# Should return 401 Unauthorized (expected without token)
```

### Check if backend accepts login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"password123"}'
# Should return: {"token":"...", "user":{...}}
```

## Files Involved
- `context/AuthContext.tsx` - Token management + localStorage
- `app/_layout.tsx` - Auth check on app start
- `screens/ProfileScreen.tsx` - Profile operations
- `main.go` - Backend auth endpoints

---

**Status:** Added better logging and auth flow handling
**Last Updated:** 8 février 2026
