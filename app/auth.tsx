import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" options={{ title: "Connexion" }} />
      <Stack.Screen name="SignUp" options={{ title: "Inscription" }} />
    </Stack>
  );
}
