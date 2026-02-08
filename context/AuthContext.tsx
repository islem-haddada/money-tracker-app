import AsyncStorage from "@react-native-async-storage/async-storage";
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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  updateProfile: (name: string, email: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

const TOKEN_KEY = "auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(TOKEN_KEY);
        if (saved) {
          setToken(saved);
          // Validate token with backend
          const res = await fetch("http://localhost:8080/api/auth/me", {
            headers: { Authorization: `Bearer ${saved}` },
          });
          if (res.ok) {
            const json = await res.json();
            setUser(json.user ?? null);
          } else {
            // invalid token
            await AsyncStorage.removeItem(TOKEN_KEY);
            setToken(null);
            setUser(null);
          }
        }
      } catch (e) {
        console.warn("AuthProvider: failed to restore token", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Login failed" }));
        Alert.alert("Erreur", err.message || "Impossible de se connecter");
        return false;
      }
      const data = await res.json();
      console.log("Login success, token:", data.token?.substring(0, 20) + "...");
      if (data.token) {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user ?? null);
        console.log("Token sauvegardé et state mis à jour");
        return true;
      }
      return false;
    } catch (e: any) {
      console.error("Login error:", e);
      Alert.alert("Erreur", e.message || "Network error");
      return false;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
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
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user ?? null);
        return true;
      }
      return false;
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Network error");
      return false;
    }
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      console.log("updateProfile: token =", token?.substring(0, 20) + "..." || "null");
      if (!token) {
        console.error("updateProfile: Aucun token disponible");
        // Essayer de récupérer depuis AsyncStorage
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (!savedToken) {
          Alert.alert("Erreur", "Pas de token. Veuillez vous reconnecter.");
          return false;
        }
        setToken(savedToken);
      }
      
      const activeToken = token || (await AsyncStorage.getItem(TOKEN_KEY));
      console.log("updateProfile: Envoi", { name, email, tokenExists: !!activeToken });
      
      const res = await fetch("http://localhost:8080/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ name, email }),
      });
      console.log("updateProfile: Status", res.status);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Erreur lors de la mise à jour" }));
        console.error("updateProfile error:", err);
        Alert.alert("Erreur", err.message || "Impossible de mettre à jour le profil");
        return false;
      }
      const data = await res.json();
      console.log("updateProfile: Réponse", data);
      if (data.user) {
        setUser(data.user);
        Alert.alert("Succès", "Profil mis à jour!");
      } else if (user) {
        setUser({ ...user, name, email });
        Alert.alert("Succès", "Profil mis à jour!");
      }
      return true;
    } catch (e: any) {
      console.error("updateProfile error:", e);
      Alert.alert("Erreur", e.message || "Erreur réseau");
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
      console.log("changePassword: token =", token?.substring(0, 20) + "..." || "null");
      if (!token) {
        const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (!savedToken) {
          Alert.alert("Erreur", "Pas de token. Veuillez vous reconnecter.");
          return false;
        }
        setToken(savedToken);
      }
      
      if (newPassword.length < 6) {
        Alert.alert("Erreur", "Le mot de passe doit avoir au moins 6 caractères");
        return false;
      }
      
      const activeToken = token || (await AsyncStorage.getItem(TOKEN_KEY));
      console.log("changePassword: Envoi");
      const res = await fetch("http://localhost:8080/api/auth/change-password", {
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
      Alert.alert("Erreur", e.message || "Erreur réseau");
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!token) return false;
      const res = await fetch("http://localhost:8080/api/auth/delete-account", {
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
      await logout();
      return true;
    } catch (e: any) {
      Alert.alert("Erreur", e.message || "Network error");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, changePassword, updateProfile, deleteAccount }}>
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
