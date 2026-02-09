import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

type User = {
  id: number;
  email: string;
  name?: string;
};

type AuthContextShape = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isOnline: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  syncWithServer: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const API_URL = "http://192.168.100.9:8080";

// Email validation
const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Network error handler
const getErrorMessage = (err: any): string => {
  if (err.message === "Network request failed") {
    return "Pas de connexion internet. Vérifiez votre connexion et réessayez.";
  }
  return err.message || "Une erreur est survenue";
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Wrapper to save user to AsyncStorage
  const setUser = async (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem(USER_KEY);
    }
  };

  // Wrapper to save token to AsyncStorage
  const setToken = async (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
    } else {
      await AsyncStorage.removeItem(TOKEN_KEY);
    }
  };

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  // Load saved data on startup
  useEffect(() => {
    (async () => {
      try {
        // Load saved user and token
        const savedUser = await AsyncStorage.getItem(USER_KEY);
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        
        console.log("AuthProvider: Loading saved data...");
        console.log("AuthProvider: User:", savedUser ? "Found" : "Not found");
        console.log("AuthProvider: Token:", savedToken ? "Found" : "Not found");
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUserState(parsedUser);
        }
        
        if (savedToken) {
          setTokenState(savedToken);
          
          // Try to validate with server if online
          try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
              headers: { Authorization: `Bearer ${savedToken}` },
            });
            if (res.ok) {
              const json = await res.json();
              if (json.user) {
                setUserState(json.user);
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(json.user));
              }
            }
          } catch (e) {
            // Offline - use saved user
            console.log("AuthProvider: Offline, using saved user");
          }
        }
        
        // If no user found, create default local user
        if (!savedUser) {
          const defaultUser = { id: 1, email: "local@user.app", name: "Utilisateur" };
          setUserState(defaultUser);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
          await AsyncStorage.setItem(TOKEN_KEY, "local-token");
          setTokenState("local-token");
        }
      } catch (e) {
        console.warn("AuthProvider: failed to restore", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Validation
      if (!email || !password) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs");
        return false;
      }

      if (!isValidEmail(email)) {
        Alert.alert("Erreur", "Email invalide");
        return false;
      }

      console.log("Fetching:", `${API_URL}/api/auth/login`);
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Response status:", res.status);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Login failed" }));
        console.log("Login failed:", err.message);
        Alert.alert("Erreur", err.message || "Impossible de se connecter");
        return false;
      }
      const data = await res.json();
      console.log("Login success, token:", data.token?.substring(0, 20) + "...");
      if (data.token) {
        await setToken(data.token);
        await setUser(data.user ?? null);
        console.log("Token sauvegardé et state mis à jour");
        return true;
      }
      return false;
    } catch (e: any) {
      console.error("Login error:", e);
      Alert.alert("Erreur de connexion", getErrorMessage(e));
      return false;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      // Validation
      if (!email || !password || !name) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs");
        return false;
      }

      if (!isValidEmail(email)) {
        Alert.alert("Erreur", "Email invalide");
        return false;
      }

      if (password.length < 6) {
        Alert.alert("Erreur", "Le mot de passe doit faire au moins 6 caractères");
        return false;
      }

      if (name.length > 100) {
        Alert.alert("Erreur", "Le nom est trop long");
        return false;
      }

      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Signup failed" }));
        Alert.alert("Erreur", err.message || "Impossible de s'inscrire");
        return false;
      }
      const data = await res.json();
      if (data.token) {
        await setToken(data.token);
        await setUser(data.user ?? null);
        return true;
      }
      return false;
    } catch (e: any) {
      console.error("Signup error:", e);
      Alert.alert("Erreur d'inscription", getErrorMessage(e));
      return false;
    }
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      // Validation
      if (!name || !email) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs");
        return false;
      }

      if (!isValidEmail(email)) {
        Alert.alert("Erreur", "Email invalide");
        return false;
      }

      if (name.length > 100) {
        Alert.alert("Erreur", "Le nom est trop long");
        return false;
      }

      // Always save locally first
      const updatedUser = { ...user, name, email, id: user?.id || 1 };
      await setUser(updatedUser);
      console.log("✅ updateProfile: User updated locally:", updatedUser);

      // Try to sync with server if online
      if (isOnline && token && !token.startsWith("local")) {
        try {
          console.log("updateProfile: Syncing with server...");
          const res = await fetch(`${API_URL}/api/auth/update-profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, email }),
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              await setUser(data.user);
              console.log("✅ updateProfile: Synced with server:", data.user);
            }
          }
        } catch (e) {
          console.log("updateProfile: Server sync failed, keeping local changes");
        }
      }

      Alert.alert("Succès", "Profil mis à jour!");
      return true;
    } catch (e: any) {
      console.error("updateProfile error:", e);
      Alert.alert("Erreur", getErrorMessage(e));
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      // Validation
      if (!oldPassword || !newPassword) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs");
        return false;
      }

      if (newPassword.length < 6) {
        Alert.alert("Erreur", "Le mot de passe doit avoir au moins 6 caractères");
        return false;
      }

      if (oldPassword === newPassword) {
        Alert.alert("Erreur", "Le nouveau mot de passe doit être différent");
        return false;
      }

      console.log("changePassword: token =", token?.substring(0, 20) + "..." || "null");
      
      let activeToken = token;
      if (!activeToken) {
        console.warn("changePassword: Token not in state, fetching from AsyncStorage");
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (!savedToken) {
          Alert.alert("Erreur", "Pas de token. Veuillez vous reconnecter.");
          return false;
        }
        activeToken = savedToken;
        setToken(savedToken);
      }
      
      console.log("changePassword: Using token", activeToken?.substring(0, 20) + "...");
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      console.log("changePassword: Status", res.status);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Erreur lors du changement" }));
        console.error("changePassword error:", err);
        Alert.alert("Erreur", err.message || "Impossible de changer le mot de passe");
        return false;
      }
      Alert.alert("Succès", "Mot de passe changé!");
      return true;
    } catch (e: any) {
      console.error("changePassword error:", e);
      Alert.alert("Erreur", getErrorMessage(e));
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      // Try to delete on server if online
      if (isOnline && token && !token.startsWith("local")) {
        const res = await fetch(`${API_URL}/api/auth/delete-account`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ message: "Erreur lors de la suppression" }));
          Alert.alert("Erreur", err.message || "Impossible de supprimer le compte");
          return false;
        }
      }
      await logout();
      return true;
    } catch (e: any) {
      Alert.alert("Erreur", getErrorMessage(e));
      return false;
    }
  };

  // Sync local data with server when connection is available
  const syncWithServer = async () => {
    if (!isOnline) {
      Alert.alert("Hors ligne", "Pas de connexion internet");
      return;
    }

    try {
      // Try to login/sync with server
      Alert.alert("Synchronisation", "Tentative de connexion au serveur...");
      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
      
      if (savedToken && !savedToken.startsWith("local")) {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        
        if (res.ok) {
          const json = await res.json();
          if (json.user) {
            await setUser(json.user);
            Alert.alert("Succès", "Données synchronisées avec le serveur!");
          }
        } else {
          Alert.alert("Info", "Token expiré. Veuillez vous reconnecter.");
        }
      } else {
        Alert.alert("Info", "Vous utilisez un compte local. Créez un compte en ligne pour synchroniser.");
      }
    } catch (e) {
      Alert.alert("Erreur", "Impossible de synchroniser avec le serveur");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      isOnline,
      login, 
      signup, 
      logout, 
      changePassword, 
      updateProfile, 
      deleteAccount, 
      setUser, 
      setToken,
      syncWithServer 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export default AuthContext;
