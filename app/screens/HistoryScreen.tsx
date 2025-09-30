import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const mockTransactions = [
  { id: "1", description: "Salaire", amount: 12000, type: "income", date: "2025-09-01" },
  { id: "2", description: "Courses", amount: 3500, type: "expense", date: "2025-09-03" },
  { id: "3", description: "Transport", amount: 800, type: "expense", date: "2025-09-05" },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Transactions</Text>
      <FlatList
        data={mockTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <Text style={[styles.amount, item.type === "income" ? styles.income : styles.expense]}>
              {item.type === "income" ? "+" : "-"} {item.amount} DA
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#222" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  desc: { fontSize: 16, fontWeight: "bold", color: "#333" },
  date: { fontSize: 12, color: "#888" },
  amount: { fontSize: 16, fontWeight: "bold" },
  income: { color: "green" },
  expense: { color: "red" },
});
