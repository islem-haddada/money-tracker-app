import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import uuid from "react-native-uuid";
import { useFinance } from "../context/FinanceContext";

export default function AddTransactionScreen() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("Autre");
  const { addTransaction } = useFinance();
  const router = useRouter();

  const categories = {
    expense: [
      { id: "Food", name: "Nourriture", icon: "restaurant-outline" },
      { id: "Shopping", name: "Shopping", icon: "cart-outline" },
      { id: "Transport", name: "Transport", icon: "car-outline" },
      { id: "Leisure", name: "Loisir", icon: "game-controller-outline" },
      { id: "Bills", name: "Factures", icon: "receipt-outline" },
      { id: "Other", name: "Autre", icon: "cube-outline" },
    ],
    income: [
      { id: "Salary", name: "Salaire", icon: "wallet-outline" },
      { id: "Gift", name: "Cadeau", icon: "gift-outline" },
      { id: "Freelance", name: "Freelance", icon: "laptop-outline" },
      { id: "Other", name: "Autre", icon: "cube-outline" },
    ],
  };

  const handleAdd = () => {
    if (!description || !amount) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }
    
    addTransaction({
      id: uuid.v4() as string,
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString().split("T")[0],
    });

    Alert.alert("Succès", "Transaction ajoutée !");
    setDescription("");
    setAmount("");
    setType("income");
    setCategory("Autre");
    router.replace("/(tabs)/home");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.container}>
        <LinearGradient colors={["#4caf50", "#2e7d32"]} style={styles.header}>
          <Text style={styles.headerTitle}>Nouvelle Transaction</Text>
          <Text style={styles.headerSubtitle}>Enregistrez vos revenus ou dépenses</Text>
        </LinearGradient>

        <View style={styles.formCard}>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === "income" && styles.incomeActive,
              ]}
              onPress={() => setType("income")}
            >
              <Ionicons 
                name="arrow-down-circle" 
                size={24} 
                color={type === "income" ? "#fff" : "#4caf50"} 
              />
              <Text style={[styles.typeBtnText, type === "income" && styles.textWhite]}>Revenu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === "expense" && styles.expenseActive,
              ]}
              onPress={() => setType("expense")}
            >
              <Ionicons 
                name="arrow-up-circle" 
                size={24} 
                color={type === "expense" ? "#fff" : "#f44336"} 
              />
              <Text style={[styles.typeBtnText, type === "expense" && styles.textWhite]}>Dépense</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="document-text-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: Salaire, Loyer..."
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Montant (DA)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="cash-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Catégorie</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories[type].map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryBtn,
                    category === cat.name && styles.categoryActive,
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <View style={[
                    styles.catIconBox,
                    category === cat.name && styles.catIconActive
                  ]}>
                    <Ionicons 
                      name={cat.icon as any} 
                      size={20} 
                      color={category === cat.name ? "#fff" : "#666"} 
                    />
                  </View>
                  <Text style={[styles.categoryText, category === cat.name && styles.activeCatText]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.addBtnContainer} onPress={handleAdd}>
            <LinearGradient
              colors={type === "income" ? ["#66bb6a", "#43a047"] : ["#ef5350", "#d32f2f"]}
              style={styles.addBtn}
            >
              <Text style={styles.addBtnText}>Confirmer la transaction</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  typeSelector: {
    flexDirection: "row",
    backgroundColor: "#f1f3f5",
    borderRadius: 16,
    padding: 6,
    marginBottom: 25,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  incomeActive: {
    backgroundColor: "#4caf50",
  },
  expenseActive: {
    backgroundColor: "#f44336",
  },
  typeBtnText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "bold",
    color: "#666",
  },
  textWhite: {
    color: "#fff",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  addBtnContainer: {
    marginTop: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
  addBtn: {
    paddingVertical: 18,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryScroll: {
    paddingVertical: 5,
    marginBottom: 10,
  },
  categoryBtn: {
    alignItems: "center",
    marginRight: 20,
    width: 70,
  },
  catIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  catIconActive: {
    backgroundColor: "#4caf50",
  },
  categoryActive: {
    opacity: 1,
  },
  categoryText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  activeCatText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
});
