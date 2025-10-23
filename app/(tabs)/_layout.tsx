
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { FinanceProvider } from "../../context/FinanceContext";
import { auth } from "../../firebaseConfig";

export default function Layout() {
  const router = useRouter();
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace({ pathname: "/auth/Login" } as any);
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
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
  );
}
