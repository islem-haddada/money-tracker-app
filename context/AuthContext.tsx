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

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
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
