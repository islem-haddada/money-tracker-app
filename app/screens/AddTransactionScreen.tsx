import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddTransactionScreen() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");

  const handleAdd = () => {
    // Ici on ajoutera la logique d'ajout réelle
    setDescription("");
    setAmount("");
    setType("income");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une transaction</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Montant"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "income" && styles.typeBtnActiveIncome]}
          onPress={() => setType("income")}
        >
          <Text style={[styles.typeBtnText, type === "income" && styles.typeBtnTextActive]}>Revenu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === "expense" && styles.typeBtnActiveExpense]}
          onPress={() => setType("expense")}
        >
          <Text style={[styles.typeBtnText, type === "expense" && styles.typeBtnTextActive]}>Dépense</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
        <Text style={styles.addBtnText}>Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f6fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#222", textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeBtn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#eee",
    alignItems: "center",
  },
  typeBtnActiveIncome: {
    backgroundColor: "#d4edda",
    borderColor: "#4caf50",
    borderWidth: 2,
  },
  typeBtnActiveExpense: {
    backgroundColor: "#f8d7da",
    borderColor: "#f44336",
    borderWidth: 2,
  },
  typeBtnText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  typeBtnTextActive: {
    color: "#222",
  },
  addBtn: {
    backgroundColor: "tomato",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
