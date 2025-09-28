import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native"; // ✅ import manquant

// ---- Types ----
export type Transaction = {
  id: string; // ✅ string uniquement (plus sûr avec AsyncStorage)
  type: "income" | "expense";
  amount: number;
  description?: string;
  title?: string;
  date?: string;
};

type FinanceContextType = {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
};

// ---- Contexte ----
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Charger les transactions au démarrage
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const stored = await AsyncStorage.getItem("transactions");
        if (stored) setTransactions(JSON.parse(stored));
      } catch (err) {
        console.error("❌ Erreur load:", err);
      }
    };
    loadTransactions();
  }, []);

  // Sauvegarder à chaque modification
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem("transactions", JSON.stringify(transactions));
      } catch (err) {
        console.error("❌ Erreur save:", err);
      }
    };
    saveTransactions();
  }, [transactions]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, deleteTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
}

// ---- Hook personnalisé ----
export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used inside FinanceProvider");
  return ctx;
};

// ---- Exemple d’utilisation ----
const TransactionItem = ({ item }: { item: Transaction }) => {
  const { deleteTransaction } = useFinance();

  return (
    <TouchableOpacity
      onPress={() =>
        Alert.alert(
          "Confirmation",
          "Supprimer cette transaction ?",
          [
            { text: "Annuler", style: "cancel" },
            { text: "Supprimer", style: "destructive", onPress: () => deleteTransaction(item.id) }
          ]
        )
      }
    >
      <Text style={{ color: "red" }}>❌ Supprimer</Text>
    </TouchableOpacity>
  );
};
// Note: Le composant TransactionItem est un exemple d’utilisation du contexte et de la suppression.