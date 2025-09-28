import React from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { useFinance } from "../context/FinanceContext";

export default function HistoryScreen() {
  const { transactions, deleteTransaction } = useFinance();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historique des Transactions</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.right}>
              <Text style={[styles.amount, item.amount > 0 ? styles.income : styles.expense]}>
                {item.amount} DA
              </Text>
              <Button title="🗑️" onPress={() => deleteTransaction(item.id)} />
            </View>
          </View>
        )}
      />

      {transactions.length === 0 && <Text style={styles.empty}>Aucune transaction enregistrée</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  desc: { fontSize: 16 },
  date: { fontSize: 12, color: "#888" },
  right: { alignItems: "flex-end" },
  amount: { fontSize: 16, fontWeight: "bold" },
  income: { color: "green" },
  expense: { color: "red" },
  empty: { marginTop: 20, textAlign: "center", color: "#555" },
});
