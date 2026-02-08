import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../context/ThemeContext";

type Props = {
  item: {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    date: string;
    category?: string;
    note?: string;
  };
  onDelete?: (id: string) => void;
};

export default function TransactionItem({ item, onDelete }: Props) {
  const { isDarkMode } = useAppTheme();

  return (
    <View style={[styles.transactionCard, isDarkMode && styles.transactionCardDark]}>
      <View style={[styles.transactionIcon, { backgroundColor: item.type === "income" ? (isDarkMode ? "#1b3320" : "#e8f5e9") : (isDarkMode ? "#3d1c1c" : "#ffebee") }]}>
        <Ionicons 
          name={item.type === "income" ? "arrow-up" : "arrow-down"} 
          size={20} 
          color={item.type === "income" ? "#4caf50" : "#f44336"} 
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={[styles.transactionDesc, isDarkMode && styles.textDark]}>{item.description || "Sans description"}</Text>
        <View style={styles.dateAndCat}>
          <Text style={styles.transactionDate}>{item.date || "Date inconnue"}</Text>
          {item.category && (
            <>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.transactionCategory}>{item.category}</Text>
            </>
          )}
        </View>
        {item.note && (
          <Text style={[styles.transactionNote, isDarkMode && styles.transactionNoteDark]}>
            📝 {item.note}
          </Text>
        )}
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.transactionAmount, { color: item.type === "income" ? "#4caf50" : "#f44336" }]}>
          {item.type === "income" ? "+" : "-"} {item.amount.toLocaleString()} DA
        </Text>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={isDarkMode ? "#666" : "#999"} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  transactionCardDark: {
    backgroundColor: "#1e1e1e",
    shadowOpacity: 0,
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
    fontWeight: "bold",
    color: "#333",
  },
  textDark: {
    color: "#fff",
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  dateAndCat: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    marginHorizontal: 5,
    color: "#ccc",
    fontSize: 12,
  },
  transactionCategory: {
    fontSize: 12,
    color: "#4caf50",
    fontWeight: "500",
  },
  transactionNote: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    fontStyle: "italic",
  },
  transactionNoteDark: {
    color: "#aaa",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "bold",
  },
  deleteBtn: {
    marginTop: 5,
    padding: 2,
  },
});
