import React, { useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { useFinance } from "../../context/FinanceContext";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
};



export default function HomeScreen() {
  const { transactions, addTransaction, deleteTransaction } = useFinance() as {
    transactions: Transaction[];
    addTransaction: (t: Transaction) => void;
    deleteTransaction: (id: string) => void;
  };

  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const handleAdd = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert("Erreur", "Veuillez entrer un montant valide !");
      return;
    }

    addTransaction({
      id: String(uuid.v4()),
      type,
      amount: Number(amount),
      description: desc || (type === "income" ? "Revenu" : "Dépense"),
      date: new Date().toLocaleString(),
    });

    setAmount("");
    setDesc("");
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const balance = filteredTransactions.reduce(
    (acc: number, t: Transaction) =>
      t.type === "income" ? acc + t.amount : acc - t.amount,
    0
  );

  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "DZD",
    }).format(num);

  return (
    <View style={styles.container}>
      <Text style={styles.balance}>💰 Solde: {formatCurrency(balance)}</Text>

      <TextInput
        style={styles.input}
        placeholder="Montant"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
      />

      <View style={styles.row}>
        <Button
          title="Revenu"
          onPress={() => setType("income")}
          color={type === "income" ? "green" : "gray"}
        />
        <Button
          title="Dépense"
          onPress={() => setType("expense")}
          color={type === "expense" ? "red" : "gray"}
        />
      </View>

      <Button title="Ajouter" onPress={handleAdd} />

      <View style={styles.filterRow}>
        <Button
          title="Tous"
          onPress={() => setFilter("all")}
          color={filter === "all" ? "#4caf50" : "gray"}
        />
        <Button
          title="Revenus"
          onPress={() => setFilter("income")}
          color={filter === "income" ? "green" : "gray"}
        />
        <Button
          title="Dépenses"
          onPress={() => setFilter("expense")}
          color={filter === "expense" ? "red" : "gray"}
        />
      </View>

      <FlatList
        data={[...filteredTransactions].reverse()} // plus récentes en haut
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.item,
              item.type === "income" ? styles.income : styles.expense,
            ]}
          >
            <View>
              <Text style={styles.text}>{item.description}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.amount}>
                {item.type === "income" ? "+" : "-"} {formatCurrency(item.amount)}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Confirmation", "Supprimer cette transaction ?", [
                    { text: "Annuler", style: "cancel" },
                    {
                      text: "Supprimer",
                      style: "destructive",
                      onPress: () => deleteTransaction(item.id),
                    },
                  ])
                }
              >
                <Text style={styles.delete}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  balance: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center" },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  income: { backgroundColor: "#d4edda" },
  expense: { backgroundColor: "#f8d7da" },
  text: { fontSize: 16, fontWeight: "bold" },
  amount: { fontSize: 16, marginLeft: 10 },
  delete: { fontSize: 18, marginLeft: 15 },
  date: { fontSize: 12, color: "#555", marginTop: 5 },
});
