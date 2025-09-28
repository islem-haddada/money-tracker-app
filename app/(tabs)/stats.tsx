import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useFinance } from "../../context/FinanceContext";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  date?: string;
};

export default function StatsScreen() {
  const { transactions } = useFinance() as { transactions: Transaction[] };

  const totalIncome = transactions
    ? transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + (t.amount || 0), 0)
    : 0;

  const totalExpense = transactions
    ? transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + (t.amount || 0), 0)
    : 0;

  const chartData = [
    {
      name: "Revenus",
      amount: Number(totalIncome),
      color: "#4caf50",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
    {
      name: "Dépenses",
      amount: Number(totalExpense),
      color: "#f44336",
      legendFontColor: "#333",
      legendFontSize: 14,
    },
  ].filter((item) => item.amount > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 20}
          height={220}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 40, color: "gray" }}>
          Aucune donnée à afficher
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
});
