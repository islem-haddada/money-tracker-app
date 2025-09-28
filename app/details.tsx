import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFinance } from "../context/FinanceContext";

export default function DetailsScreen() {
  const { addTransaction } = useFinance();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Erreur", "Le montant doit être un nombre positif");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      addTransaction({
        id: Date.now().toString(),
        title,
        amount: parsedAmount,
        type,
        date: new Date().toISOString(),
      });
      setLoading(false);
      Alert.alert("Succès", "Transaction ajoutée ✅");
      setTitle("");
      setAmount("");
      setType("income");
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Ajouter une transaction</Text>

      <TextInput
        placeholder="Titre"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Montant"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
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

      <TouchableOpacity
        style={[styles.addBtn, loading && styles.addBtnDisabled]}
        onPress={handleAdd}
        disabled={loading}
      >
        <Text style={styles.addBtnText}>{loading ? "Ajout..." : "Ajouter"}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
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
  addBtnDisabled: {
    opacity: 0.6,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
