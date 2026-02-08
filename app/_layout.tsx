import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { FinanceProvider } from "../context/FinanceContext";
import { NotesProvider } from "../context/NotesContext";
import { ThemeProvider, useAppTheme } from "../context/ThemeContext";

function RootLayoutContent() {
  const { isDarkMode } = useAppTheme();

  return (
    <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="details" options={{ title: "Détails" }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FinanceProvider>
          <NotesProvider>
            <RootLayoutContent />
          </NotesProvider>
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
