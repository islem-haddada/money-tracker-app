import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { isDarkMode } = useAppTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    
    console.log("Attempting login with:", email);
    setLoading(true);
    try {
      const ok = await login(email.trim().toLowerCase(), password);
      if (ok) {
        router.replace({ pathname: "/(tabs)/home" } as any);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient 
          colors={isDarkMode ? ["#1a237e", "#121212"] : ["#4caf50", "#2e7d32"]} 
          style={styles.container}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="wallet" size={60} color="#fff" />
            </View>
            <Text style={styles.title}>Money Tracker</Text>
            <Text style={styles.subtitle}>Gérez vos finances avec simplicité</Text>
          </View>

          <View style={[styles.formContainer, isDarkMode && styles.formContainerDark]}>
            <Text style={[styles.loginTitle, isDarkMode && styles.loginTitleDark]}>Connexion</Text>
            
            <View style={[styles.inputWrapper, isDarkMode && styles.inputWrapperDark]}>
              <Ionicons name="mail-outline" size={20} color={isDarkMode ? "#aaa" : "#666"} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? "#555" : "#999"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={true}
                autoFocus={true}
              />
            </View>

            <View style={[styles.inputWrapper, isDarkMode && styles.inputWrapperDark]}>
              <Ionicons name="lock-closed-outline" size={20} color={isDarkMode ? "#aaa" : "#666"} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, isDarkMode && styles.inputDark]}
                placeholder="Mot de passe"
                placeholderTextColor={isDarkMode ? "#555" : "#999"}
                value={password}
                editable={true}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.7 }]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={["#4caf50", "#388e3c"]}
                style={styles.gradientButton}
              >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Se connecter</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Pas de compte ? </Text>
              <TouchableOpacity onPress={() => router.replace({ pathname: "/auth/SignUp" } as any)}>
                <Text style={styles.link}>Créer un compte</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  formContainerDark: {
    backgroundColor: "#1e1e1e",
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
    textAlign: "center",
  },
  loginTitleDark: {
    color: "#fff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f6f7",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputWrapperDark: {
    backgroundColor: "#2c2c2c",
    borderColor: "#333",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  inputDark: {
    color: "#fff",
  },
  button: {
    marginTop: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#777",
    fontSize: 14,
  },
  link: {
    color: "#4caf50",
    fontSize: 14,
    fontWeight: "bold",
  },
});

