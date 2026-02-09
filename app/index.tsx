import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading, setUser, setToken } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Auto-login with demo user for offline mode
      const demoUser = { id: 1, email: "demo@localhost", name: "Demo User" };
      setUser(demoUser);
      setToken("demo-token-local");
      setReady(true);
    } else if (user) {
      setReady(true);
    }
  }, [loading, user]);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  return <Redirect href="/(tabs)/home" />;
}
