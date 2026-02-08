import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import uuid from "react-native-uuid";
import { useFinance } from "../context/FinanceContext";
import { useAppTheme } from "../context/ThemeContext";

export default function DebtsScreen() {
  const { debts, addDebt, deleteDebt, toggleDebtPaid } = useFinance();
  const { isDarkMode } = useAppTheme();
  const [person, setPerson] = useState("");
  const [amount, setAmount] = useState("");

  const handleAddDebt = () => {
    if (!person || !amount) {
      Alert.alert("Erreur", "Veuillez remplir le nom et le montant");
      return;
    }
    addDebt({
      id: uuid.v4() as string,
      person,
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString(),
      isPaid: false,
    });
    setPerson("");
    setAmount("");
  };

  const confirmDelete = (id: string) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer cette dette ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => deleteDebt(id) },
    ]);
  };

  const totalOwed = debts.filter((d) => !d.isPaid).reduce((acc, d) => acc + d.amount, 0);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, isDarkMode && styles.containerDark]}
    >
      <LinearGradient colors={isDarkMode ? ["#b71c1c", "#000"] : ["#f44336", "#c62828"]} style={styles.header}>
        <Text style={styles.headerTitle}>Gestion des Dettes</Text>
        <Text style={styles.headerSubtitle}>Gents li ysaloni sward</Text>
        <View style={[styles.totalCard, isDarkMode && styles.totalCardDark]}>
          <Text style={[styles.totalLabel, isDarkMode && styles.textDark]}>Total à rembourser</Text>
          <Text style={[styles.totalValue, isDarkMode && styles.textDark]}>{totalOwed.toLocaleString()} DA</Text>
        </View>
      </LinearGradient>

      <View style={[styles.content, isDarkMode && styles.contentDark]}>
        <View style={[styles.inputCard, isDarkMode && styles.inputCardDark]}>
          <View style={[styles.inputWrapper, isDarkMode && styles.inputWrapperDark]}>
            <Ionicons name="person-outline" size={20} color={isDarkMode ? "#aaa" : "#666"} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              placeholder="Qui vous a prêté ?"
              placeholderTextColor={isDarkMode ? "#555" : "#999"}
              value={person}
              onChangeText={setPerson}
            />
          </View>
          <View style={[styles.inputWrapper, isDarkMode && styles.inputWrapperDark]}>
            <Ionicons name="cash-outline" size={20} color={isDarkMode ? "#aaa" : "#666"} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              placeholder="Montant (DA)"
              placeholderTextColor={isDarkMode ? "#555" : "#999"}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.addBtnContainer} onPress={handleAddDebt}>
            <LinearGradient colors={["#333", "#000"]} style={styles.addBtn}>
              <Text style={styles.addBtnText}>Ajouter la dette</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <FlatList
          data={debts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.debtCard, item.isPaid && styles.paidCard, isDarkMode && styles.debtCardDark, item.isPaid && isDarkMode && styles.paidCardDark]}>
              <View style={styles.debtIcon}>
                <Ionicons 
                  name={item.isPaid ? "checkmark-done" : "time-outline"} 
                  size={24} 
                  color={item.isPaid ? "#4caf50" : "#f44336"} 
                />
              </View>
              <View style={styles.debtInfo}>
                <Text style={[styles.personName, item.isPaid && styles.paidText]}>{item.person}</Text>
                <Text style={styles.debtDate}>{item.date}</Text>
              </View>
              <View style={styles.debtActions}>
                <Text style={[styles.debtAmount, item.isPaid && styles.paidText]}>
                  {item.amount.toLocaleString()} DA
                </Text>
                <TouchableOpacity onPress={() => toggleDebtPaid(item.id)} style={styles.actionBtn}>
                  <Ionicons
                    name={item.isPaid ? "radio-button-on" : "radio-button-off"}
                    size={24}
                    color={item.isPaid ? "#4caf50" : "#999"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.id)} style={styles.actionBtn}>
                  <Ionicons name="trash-outline" size={20} color="#e53935" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="happy-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Aucune dette. Vous êtes libre ! 🎉</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
    paddingBottom: 50,
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
    marginBottom: 20,
  },
  totalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  totalLabel: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#f44336",
  },
  content: {
    flex: 1,
    padding: 20,
    marginTop: -30,
  },
  inputCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    marginBottom: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  addBtnContainer: {
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 5,
  },
  addBtn: {
    paddingVertical: 15,
    alignItems: "center",
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  debtCard: {
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
  paidCard: {
    opacity: 0.6,
    backgroundColor: "#f1f3f5",
  },
  debtIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  debtInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  debtDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  debtActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  debtAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f44336",
    marginRight: 10,
  },
  actionBtn: {
    padding: 5,
    marginLeft: 5,
  },
  paidText: {
    textDecorationLine: "line-through",
    color: "#aaa",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#999",
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  contentDark: {
    backgroundColor: "#121212",
  },
  inputCardDark: {
    backgroundColor: "#1e1e1e",
  },
  inputWrapperDark: {
    backgroundColor: "#2d2d2d",
    borderColor: "#444",
  },
  inputDark: {
    color: "#fff",
    backgroundColor: "#2d2d2d",
  },
  totalCardDark: {
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  debtCardDark: {
    backgroundColor: "#1e1e1e",
  },
  paidCardDark: {
    opacity: 0.6,
    backgroundColor: "#252525",
  },
  textDark: {
    color: "#fff",
  },
});


