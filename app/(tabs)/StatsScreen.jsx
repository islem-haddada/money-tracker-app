import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useFinance } from "../../context/FinanceContext";

export default function StatsScreen() {
  const { transactions } = useFinance();

  // Calcul des totaux
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const chartData = [
    {
      name: "Revenus",
      amount: totalIncome,
      color: "green",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
    {
      name: "Dépenses",
      amount: totalExpense,
      color: "red",
      legendFontColor: "#333",
      legendFontSize: 15,
    },
  ];

  const screenWidth = Dimensions.get("window").width - 40;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistiques</Text>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <View style={styles.summary}>
        <Text style={styles.income}>💚 Total revenus: {totalIncome} DA</Text>
        <Text style={styles.expense}>❤️ Total dépenses: {totalExpense} DA</Text>
        <Text style={styles.balance}>
          🏦 Solde: {totalIncome - totalExpense} DA
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  summary: { marginTop: 20, alignItems: "center" },
  income: { fontSize: 16, color: "green", marginBottom: 5 },
  expense: { fontSize: 16, color: "red", marginBottom: 5 },
  balance: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
});
