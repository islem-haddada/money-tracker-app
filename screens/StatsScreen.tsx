import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useFinance } from "../context/FinanceContext";

type TimeRange = "all" | "day" | "week" | "month";

export default function StatsScreen() {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState<TimeRange>("all");

  const filterTransactions = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    return transactions.filter((t) => {
      if (filter === "all") return true;
      if (!t.date) return false;

      const tDate = new Date(t.date);
      if (filter === "day") {
        return t.date === today;
      }

      if (filter === "week") {
        const diff = (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24);
        return diff <= 7;
      }

      if (filter === "month") {
        const diff = (now.getTime() - tDate.getTime()) / (1000 * 3600 * 24);
        return diff <= 30;
      }

      return true;
    });
  };

  const filtered = filterTransactions();

  const totalIncome = filtered
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const totalExpense = filtered
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  const balance = totalIncome - totalExpense;

  const data = [
    {
      name: "Revenus",
      population: totalIncome,
      color: "#4caf50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 14,
    },
    {
      name: "Dépenses",
      population: totalExpense,
      color: "#f44336",
      legendFontColor: "#7F7F7F",
      legendFontSize: 14,
    },
  ];

  const FilterTab = ({ id, label }: { id: TimeRange; label: string }) => (
    <TouchableOpacity 
      onPress={() => setFilter(id)}
      style={[styles.tab, filter === id && styles.activeTab]}
    >
      <Text style={[styles.tabText, filter === id && styles.activeTabText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={["#4caf50", "#2e7d32"]} style={styles.header}>
        <Text style={styles.headerTitle}>Analyses Financières</Text>
        <Text style={styles.headerSubtitle}>Visualisez vos flux de trésorerie</Text>
      </LinearGradient>

      <View style={styles.filterBar}>
        <FilterTab id="all" label="Tout" />
        <FilterTab id="day" label="Jour" />
        <FilterTab id="week" label="Semaine" />
        <FilterTab id="month" label="Mois" />
      </View>

      <View style={styles.content}>
        <View style={styles.chartCard}>
          <Text style={styles.cardTitle}>Répartition des flux</Text>
          <View style={styles.chartWrapper}>
            {(totalIncome + totalExpense) > 0 ? (
              <PieChart
                data={data}
                width={Dimensions.get("window").width - 80}
                height={200}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="pie-chart-outline" size={48} color="#ccc" />
                <Text style={styles.noData}>Aucune donnée à afficher pour le moment</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Résumé détaillé</Text>
          
          <View style={styles.detailItem}>
            <View style={[styles.indicator, { backgroundColor: "#4caf50" }]} />
            <Text style={styles.detailLabel}>Total revenus</Text>
            <Text style={[styles.detailValue, { color: "#4caf50" }]}>+{totalIncome.toLocaleString()} DA</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={[styles.indicator, { backgroundColor: "#f44336" }]} />
            <Text style={styles.detailLabel}>Total dépenses</Text>
            <Text style={[styles.detailValue, { color: "#f44336" }]}>-{totalExpense.toLocaleString()} DA</Text>
          </View>

          <View style={[styles.detailItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Balance Finale</Text>
            <Text style={[styles.totalValue, { color: balance >= 0 ? "#2e7d32" : "#c62828" }]}>
              {balance.toLocaleString()} DA
            </Text>
          </View>
        </View>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  filterBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 16,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: "space-between",
    zIndex: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#4caf50",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },
  content: {
    padding: 20,
    marginTop: 10,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    color: "#666",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalItem: {
    borderBottomWidth: 0,
    paddingTop: 20,
    marginTop: 5,
  },
  totalLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#333",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noData: {
    color: "#999",
    fontStyle: "italic",
  },
});

