import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const [isDark, setIsDark] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres ⚙️</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Mode sombre</Text>
        <Switch
          value={isDark}
          onValueChange={setIsDark}
          thumbColor={isDark ? "#4caf50" : "#ccc"}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={notifEnabled}
          onValueChange={setNotifEnabled}
          thumbColor={notifEnabled ? "#4caf50" : "#ccc"}
        />
      </View>
      <Text style={styles.subtitle}>Configure ton application ici.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f6fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginTop: 30,
    textAlign: "center",
  },
});
