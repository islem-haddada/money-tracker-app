import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  amount: number;
  type: "income" | "expense";
  date: string;
};

export default function TransactionItem({ title, amount, type, date }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, { color: type === "income" ? "green" : "red" }]}>
        {type === "income" ? "+" : "-"} {amount} DA
      </Text>
      <Text style={styles.date}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  title: { fontSize: 16, fontWeight: "bold" },
  amount: { fontSize: 16 },
  date: { fontSize: 12, color: "#666" },
});
