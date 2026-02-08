# 🧪 Testing Guide - Token & Profile Updates

## Test Cases

### Test 1: Fresh Login → Profile Update
**Steps:**
1. Delete app data (clear cache)
2. Login avec `test@gmail.com`
3. Immédiatement aller à Profile
4. Cliquer sur "Modifier les informations"
5. Changer le nom et email
6. Cliquer "Enregistrer"

**Expected:** ✅ Profil mis à jour avec succès

**Logs à vérifier:**
```
LOG  Login success, token: abc123def456...
LOG  Token sauvegardé et state mis à jour
LOG  updateProfile: token = abc123def456...
LOG  updateProfile: Using token = abc123def456...
LOG  updateProfile: Status 200
```

---

### Test 2: App Restart → Profile Update
**Steps:**
1. Login avec `test@gmail.com`
2. Fermer et relancer l'app
3. Attendre le loading (vérifier loading spinner)
4. Aller à Profile
5. Cliquer sur "Modifier les informations"
6. Changer le nom
7. Cliquer "Enregistrer"

**Expected:** ✅ Token restauré depuis AsyncStorage et profil mis à jour

**Logs à vérifier:**
```
LOG  useEffect: restore token from storage
LOG  useEffect: token restored and validated
LOG  updateProfile: token = undefined...
LOG  updateProfile: Token not in state, fetching from AsyncStorage
LOG  updateProfile: Using token = abc123def456...
LOG  updateProfile: Status 200
```

---

### Test 3: Change Password
**Steps:**
1. Login
2. Aller à Profile → "Modifier le mot de passe"
3. Entrer ancien password: `password123`
4. Entrer nouveau: `newpassword123`
5. Confirmer

**Expected:** ✅ "Mot de passe changé avec succès!"

**Logs à vérifier:**
```
LOG  changePassword: token = abc123def456...
LOG  changePassword: Using token = abc123def456...
LOG  changePassword: Status 200
SUCCESS  Mot de passe changé!
```

---

### Test 4: Delete Account
**Steps:**
1. Login
2. Aller à Profile → "Supprimer le compte"
3. Confirmer la suppression

**Expected:** ✅ Compte supprimé et redirigé vers login

**Logs à vérifier:**
```
LOG  deleteAccount: Using token = abc123def456...
LOG  deleteAccount: Status 200
ALERT  Compte supprimé avec succès
NAVIGATE  /auth/Login
```

---

### Test 5: Loading State During Init
**Steps:**
1. Fermer l'app complètement
2. Relancer l'app
3. Immédiatement (avant fin du loading) cliquer sur Profile
4. Essayer de mettre à jour le profil

**Expected:** ✅ Alert "L'app est en cours de chargement..." et bouton désactivé

**Logs à vérifier:**
```
handleUpdateProfile: loading = true
ALERT  Attendez, L'app est en cours de chargement...
```

---

### Test 6: Network Error Handling
**Steps:**
1. Arrêter le backend Go server
2. Login (devrait échouer)
3. Relancer le backend
4. Login
5. Aller à Profile et mettre à jour

**Expected:** ✅ Messages d'erreur clairs en cas d'erreur réseau

**Logs à vérifier:**
```
ERROR  Network request failed
ALERT  Pas de connexion internet. Vérifiez votre connexion et réessayez.
```

---

## Console Logs À Vérifier

### ✅ Successful Flow
```
LOG  handleUpdateProfile: Appel de updateProfile avec { newName: "...", newEmail: "..." }
LOG  updateProfile: token = abc123def456...
LOG  updateProfile: Using token = abc123def456...
LOG  updateProfile: Status 200
LOG  handleUpdateProfile: Résultat true
ALERT  Succès, Profil mis à jour!
```

### ❌ Error Flow
```
ERROR  updateProfile: Aucun token disponible
LOG  handleUpdateProfile: Résultat false
ALERT  Erreur, Impossible de mettre à jour le profil
```

### ⏳ Loading Recovery Flow
```
LOG  updateProfile: token = undefined...
LOG  updateProfile: Token not in state, fetching from AsyncStorage
LOG  updateProfile: Using token = abc123def456...
LOG  updateProfile: Status 200
LOG  handleUpdateProfile: Résultat true
ALERT  Succès, Profil mis à jour!
```

---

## Credentials Pour Tester
```
Email: test@gmail.com
Password: password123
Nom: Test User
```

---

## Vérifier Après Chaque Test
- [ ] Pas d'erreurs console
- [ ] Les données sont correctement sauvegardées
- [ ] Le token est utilisé correctement
- [ ] Les messages d'erreur sont clairs
- [ ] L'UI responsive (pas de freezing)
