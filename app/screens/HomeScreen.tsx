import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
};

export default function HomeScreen() {
  // Mock data pour l'exemple
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "income",
      amount: 12000,
      description: "Salaire",
      date: "2025-09-01",
    },
    {
      id: "2",
      type: "expense",
      amount: 3500,
      description: "Courses",
      date: "2025-09-03",
    },
    {
      id: "3",
      type: "expense",
      amount: 800,
      description: "Transport",
      date: "2025-09-05",
    },
  ]);

  const balance = transactions.reduce(
    (acc, t) => t.type === "income" ? acc + t.amount : acc - t.amount,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Money Tracker</Text>
      <Text style={styles.subtitle}>Suivez vos revenus et dépenses facilement</Text>

      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Solde actuel</Text>
        <Text style={styles.balance}>{balance} DA</Text>
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={() => {/* navigation vers ajout */}}>
        <Text style={styles.addBtnText}>+ Ajouter une transaction</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Dernières transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transDesc}>{item.description}</Text>
              <Text style={styles.transDate}>{item.date}</Text>
            </View>
            <Text style={[styles.transAmount, item.type === "income" ? styles.income : styles.expense]}>
              {item.type === "income" ? "+" : "-"} {item.amount} DA
            </Text>
          </View>
        )}
        style={{ width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  balanceBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    width: "100%",
  },
  balanceLabel: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  balance: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4caf50",
  },
  addBtn: {
    backgroundColor: "#4caf50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 25,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
    color: "#222",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  transDesc: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transDate: {
    fontSize: 12,
    color: "#888",
  },
  transAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  income: {
    color: "green",
  },
  expense: {
    color: "red",
  },
});
