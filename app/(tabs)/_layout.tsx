
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { AuthProvider } from "../../context/AuthContext";
import { FinanceProvider } from "../../context/FinanceContext";

export default function Layout() {
  return (
    <AuthProvider>
      <FinanceProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";
            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "History") {
              iconName = "list";
            } else if (route.name === "Add") {
              iconName = "add-circle";
            } else if (route.name === "Stats") {
              iconName = "bar-chart";
            } else if (route.name === "Profile") {
              iconName = "person";
            } else if (route.name === "Settings") {
              iconName = "settings";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4caf50",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tabs.Screen name="home" options={{ title: "Accueil" }} />
        <Tabs.Screen name="history" options={{ title: "Historique" }} />
        <Tabs.Screen name="add" options={{ title: "Ajouter" }} />
        <Tabs.Screen name="stats" options={{ title: "Stats" }} />
        <Tabs.Screen name="profile" options={{ title: "Profil" }} />
        <Tabs.Screen name="settings" options={{ title: "Paramètres" }} />
      </Tabs>
      </FinanceProvider>
    </AuthProvider>
  );
}
