import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function StatsScreen() {
  // Mock data
  const totalIncome = 12000;
  const totalExpense = 4300;
  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <View style={styles.box}>
        <Text style={styles.income}>💚 Total revenus: {totalIncome} DA</Text>
        <Text style={styles.expense}>❤️ Total dépenses: {totalExpense} DA</Text>
        <Text style={styles.balance}>🏦 Solde: {balance} DA</Text>
      </View>
      {/* Ici on pourra ajouter un graphique plus tard */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#222", textAlign: "center" },
  box: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  income: { fontSize: 16, color: "green", marginBottom: 5 },
  expense: { fontSize: 16, color: "red", marginBottom: 5 },
  balance: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
});
