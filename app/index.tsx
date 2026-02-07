import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/auth/Login" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
