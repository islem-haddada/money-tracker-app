import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useFinance } from "../context/FinanceContext";
export default function AddTransactionScreen({ navigation }) {
  const { addTransaction } = useFinance();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const handleAdd = () => {
    if (!description || !amount) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    addTransaction(description, parseFloat(amount));
    setDescription("");
    setAmount("");
    navigation.goBack(); // retourner en arrière après ajout
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une Transaction</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Montant (ex: 200 ou -50)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Button title="Ajouter" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
