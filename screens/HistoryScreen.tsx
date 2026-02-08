import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TransactionItem from "../components/TransactionItem";
import { useFinance } from "../context/FinanceContext";
import { useAppTheme } from "../context/ThemeContext";

type TimeRange = "all" | "day" | "week" | "month";

export default function HistoryScreen() {
  const { transactions, deleteTransaction } = useFinance();
  const [filter, setFilter] = useState<TimeRange>("all");
  const { isDarkMode } = useAppTheme();

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Supprimer",
      "Voulez-vous vraiment supprimer cette transaction ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => deleteTransaction(id) }
      ]
    );
  };

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
    }).sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime());
  };

  const filtered = filterTransactions();

  const FilterTab = ({ id, label }: { id: TimeRange; label: string }) => (
    <TouchableOpacity 
      onPress={() => setFilter(id)}
      style={[
        styles.tab, 
        filter === id && styles.activeTab,
        isDarkMode && styles.tabDark,
        isDarkMode && filter === id && styles.activeTabDark
      ]}
    >
      <Text style={[
        styles.tabText, 
        filter === id && styles.activeTabText,
        isDarkMode && styles.tabTextDark
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <LinearGradient 
        colors={isDarkMode ? ["#1a237e", "#121212"] : ["#4caf50", "#2e7d32"]} 
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Historique</Text>
        <Text style={styles.headerSubtitle}>Toutes vos transactions passées</Text>
      </LinearGradient>

      <View style={[styles.filterBar, isDarkMode && styles.filterBarDark]}>
        <FilterTab id="all" label="Tout" />
        <FilterTab id="day" label="Jour" />
        <FilterTab id="week" label="Semaine" />
        <FilterTab id="month" label="Mois" />
      </View>

      <View style={styles.content}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color={isDarkMode ? "#444" : "#ccc"} />
            <Text style={[styles.emptyText, isDarkMode && styles.emptyTextDark]}>Aucune transaction trouvée.</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionItem item={item} onDelete={confirmDelete} />}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
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
    marginTop: -25,
    borderRadius: 16,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: "space-between",
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
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
  emptyText: {
    color: "#999",
    marginTop: 15,
    fontSize: 16,
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  filterBarDark: {
    backgroundColor: "#1e1e1e",
    elevation: 2,
  },
  tabDark: {
    backgroundColor: "transparent",
  },
  activeTabDark: {
    backgroundColor: "#388e3c",
  },
  tabTextDark: {
    color: "#aaa",
  },
  emptyTextDark: {
    color: "#444",
  },
});

