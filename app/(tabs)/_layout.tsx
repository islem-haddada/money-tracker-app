
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";
            if (route.name === "home") {
              iconName = "home";
            } else if (route.name === "history") {
              iconName = "list";
            } else if (route.name === "add") {
              iconName = "add-circle";
            } else if (route.name === "debts") {
              iconName = "wallet";
            } else if (route.name === "stats") {
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
        <Tabs.Screen name="home" options={{ title: "Accueil" }} />
        <Tabs.Screen name="history" options={{ title: "Historique" }} />
        <Tabs.Screen name="add" options={{ title: "Ajouter" }} />
        <Tabs.Screen name="debts" options={{ title: "Dettes" }} />
        <Tabs.Screen name="stats" options={{ title: "Stats" }} />
        <Tabs.Screen name="profile" options={{ title: "Profil" }} />
        <Tabs.Screen name="settings" options={{ title: "Paramétres" }} />
      </Tabs>
  );
}
