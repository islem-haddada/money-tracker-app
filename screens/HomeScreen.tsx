import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TransactionItem from "../components/TransactionItem";
import { useAuth } from "../context/AuthContext";
import { useFinance } from "../context/FinanceContext";
import { useAppTheme } from "../context/ThemeContext";

export default function HomeScreen() {
  const { transactions } = useFinance();
  const { user } = useAuth();
  const { isDarkMode } = useAppTheme();
  const router = useRouter();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.containerDark]}>
      <LinearGradient
        colors={isDarkMode ? ["#1a237e", "#121212"] : ["#4caf50", "#2e7d32"]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.welcomeText}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.name || "Bienvenue"}</Text>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde total</Text>
          <Text style={styles.balanceValue}>{balance.toLocaleString()} DA</Text>
          
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Ionicons name="arrow-down-circle" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Revenus</Text>
                <Text style={styles.summaryValue}>+{totalIncome.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Ionicons name="arrow-up-circle" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Dépenses</Text>
                <Text style={styles.summaryValue}>-{totalExpense.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.content, isDarkMode && styles.contentDark]}>
        <View style={[styles.actionRow, isDarkMode && styles.actionRowDark]}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/add")}>
            <LinearGradient colors={["#66bb6a", "#43a047"]} style={styles.actionIcon}>
              <Ionicons name="add" size={28} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionText, isDarkMode && styles.actionTextDark]}>Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/history")}>
            <LinearGradient colors={["#42a5f5", "#1e88e5"]} style={styles.actionIcon}>
              <Ionicons name="list" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionText, isDarkMode && styles.actionTextDark]}>Historique</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/stats")}>
            <LinearGradient colors={["#ffa726", "#fb8c00"]} style={styles.actionIcon}>
              <Ionicons name="pie-chart" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionText, isDarkMode && styles.actionTextDark]}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push("/(tabs)/debts")}>
            <LinearGradient colors={["#ef5350", "#e53935"]} style={styles.actionIcon}>
              <Ionicons name="wallet" size={24} color="#fff" />
            </LinearGradient>
            <Text style={[styles.actionText, isDarkMode && styles.actionTextDark]}>Dettes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Transactions récentes</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/history")}>
            <Text style={styles.seeAll}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={isDarkMode ? "#444" : "#ccc"} />
            <Text style={[styles.emptyText, isDarkMode && styles.emptyTextDark]}>Aucune transaction pour le moment.</Text>
          </View>
        ) : (
          transactions.slice(-5).reverse().map((item) => (
            <TransactionItem key={item.id} item={item} />
          ))
        )}
      </View>
      <View style={{ height: 100 }} />
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
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  welcomeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
  },
  userName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  summaryLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 15,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: 25,
  },
  actionBtn: {
    alignItems: "center",
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    color: "#4caf50",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#999",
    marginTop: 10,
    fontSize: 16,
  },
  transactionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  contentDark: {
    backgroundColor: "#121212",
  },
  actionRowDark: {
    backgroundColor: "#1e1e1e",
    shadowColor: "#000",
    elevation: 2,
  },
  actionTextDark: {
    color: "#ccc",
  },
  sectionTitleDark: {
    color: "#fff",
  },
  emptyTextDark: {
    color: "#555",
  },
});

