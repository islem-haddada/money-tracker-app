import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { FinanceProvider } from "../../context/FinanceContext";

export default function Layout() {
  return (
    <FinanceProvider>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            if (route.name === "index") {
              iconName = "home";
            } else if (route.name === "stats" || route.name === "StatsScreen") {
              iconName = "bar-chart";
            } else if (route.name === "profile") {
              iconName = "person";
            } else if (route.name === "settings") {
              iconName = "settings";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4caf50",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tabs.Screen name="index" options={{ title: "Accueil" }} />
        <Tabs.Screen name="StatsScreen" options={{ title: "Stats" }} />
        <Tabs.Screen name="profile" options={{ title: "Profil" }} />
        <Tabs.Screen name="settings" options={{ title: "Paramètres" }} />
      </Tabs>
    </FinanceProvider>
  );
}
