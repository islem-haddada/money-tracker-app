import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    // User is now auto-created in AuthContext if none exists
    if (!loading) {
      setReady(true);
    }
  }, [loading]);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  return <Redirect href="/(tabs)/home" />;
}
