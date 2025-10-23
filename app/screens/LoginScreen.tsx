import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    const ok = await login(email, password);
    if (ok) {
      Alert.alert("Succ\u00e8s", "Connexion r\u00e9ussie");
      router.replace({ pathname: "/(tabs)/home" } as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace({ pathname: "/auth/SignUp" } as any)}>
        <Text style={styles.link}>Cr\u00e9er un compte</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16, backgroundColor: "#fff" },
  button: { backgroundColor: "#4caf50", padding: 15, borderRadius: 8, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { color: "#4caf50", marginTop: 15, fontSize: 16 },
});
