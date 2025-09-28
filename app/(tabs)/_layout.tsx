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
            } else if (route.name === "stats") {
              iconName = "bar-chart";
            } else if (route.name === "profile") {
              iconName = "person";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4caf50",
          tabBarInactiveTintColor: "gray",
        })}
      />
    </FinanceProvider>
  );
}
