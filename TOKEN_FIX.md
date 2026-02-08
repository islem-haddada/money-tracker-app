# 🔑 Token Loading Bug Fix

## Le Problème
Quand l'utilisateur accédait à ProfileScreen et essayait de mettre à jour son profil, le token était `undefined` même si l'utilisateur était connecté. Cela causait l'erreur:
```
ERROR updateProfile: Aucun token disponible
Token loading failed
```

## Cause Racine
1. **Timing issue**: Le token n'est pas immédiatement disponible dans l'état quand `updateProfile()` est appelée
2. **AsyncStorage async**: `setToken()` est asynchrone et ne retourne pas immédiatement la valeur
3. **State lag**: Le state `token` n'était pas mis à jour à temps

## Solution Appliquée

### 1. AuthContext.tsx - Token Recovery Logic
**Avant:**
```tsx
const activeToken = token || (await AsyncStorage.getItem(TOKEN_KEY));
// Mais setToken() est async - la variable activeToken peut être null!
```

**Après:**
```tsx
let activeToken = token;
if (!activeToken) {
  const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
  if (!savedToken) {
    Alert.alert("Erreur", "Pas de token. Veuillez vous reconnecter.");
    return false;
  }
  activeToken = savedToken;  // Utiliser directement la valeur fetched
  setToken(savedToken);      // Mettre à jour l'état en parallèle
}
```

**Avantages:**
- ✅ On récupère le token de AsyncStorage immédiatement
- ✅ On l'utilise directement sans attendre `setToken()`
- ✅ On met à jour l'état pour les prochains appels
- ✅ Pas de race condition

### 2. ProfileScreen.tsx - Loading State Check
**Avant:** Pas de vérification du loading state

**Après:**
```tsx
const { user, logout, changePassword, updateProfile, deleteAccount, loading } = useAuth();

const handleUpdateProfile = async () => {
  if (loading) {
    Alert.alert("Attendez", "L'app est en cours de chargement...");
    return;
  }
  // ... rest of logic
}

// Button disabled during loading
<TouchableOpacity 
  style={[styles.saveBtn, loading && { opacity: 0.6 }]} 
  onPress={handleUpdateProfile} 
  disabled={loading}
>
  <Text>{loading ? "Chargement..." : "Enregistrer"}</Text>
</TouchableOpacity>
```

**Avantages:**
- ✅ Empêche l'utilisateur de cliquer pendant le chargement
- ✅ User feedback visuel clair
- ✅ Évite les double-requests

## Methodes Corrigées
1. ✅ `updateProfile()` - Récupère token depuis AsyncStorage si nécessaire
2. ✅ `changePassword()` - Même logique
3. ✅ ProfileScreen - Vérifie loading state avant chaque action

## Tests À Faire
```
✓ Login → Allez à Profile → Update Profile (sans refresh)
✓ Restart app → Allez à Profile → Update Profile (token doit être restauré)
✓ Refresh app pendant chargement → Vérifier loading state
✓ Change password → Vérifier token utilisé correctement
✓ Delete account → Vérifier token utilisé correctement
```

## Logs de Debug
L'app affiche maintenant:
```
LOG  updateProfile: token = undefined...
LOG  updateProfile: Token not in state, fetching from AsyncStorage
LOG  updateProfile: Using token = abc123def456...
LOG  updateProfile: Status 200
```

Cela permet de déboguer facilement le flow du token.

## Files Modifiés
- `context/AuthContext.tsx` - Logic de token recovery
- `screens/ProfileScreen.tsx` - Loading state checks
