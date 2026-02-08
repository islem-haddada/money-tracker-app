import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native"; // ✅ import manquant

// ---- Types ----
export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  description?: string;
  title?: string;
  date?: string;
  category?: string;
  note?: string;
};

export type Debt = {
  id: string;
  person: string;
  amount: number;
  date: string;
  isPaid: boolean;
};

type FinanceContextType = {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  debts: Debt[];
  addDebt: (d: Debt) => void;
  deleteDebt: (id: string) => void;
  toggleDebtPaid: (id: string) => void;
};

// ---- Contexte ----
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);

  // Charger les données au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem("transactions");
        const storedDebts = await AsyncStorage.getItem("debts");
        if (storedTransactions) {
          const parsed = JSON.parse(storedTransactions);
          setTransactions(parsed.map((t: any) => ({ ...t, amount: Number(t.amount) || 0 })));
        }
        if (storedDebts) {
          const parsed = JSON.parse(storedDebts);
          setDebts(parsed.map((d: any) => ({ ...d, amount: Number(d.amount) || 0 })));
        }
      } catch (err) {
        console.error("❌ Erreur load:", err);
      }
    };
    loadData();
  }, []);

  // Sauvegarder à chaque modification
  useEffect(() => {
    AsyncStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    AsyncStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addDebt = (debt: Debt) => {
    setDebts((prev) => [...prev, debt]);
  };

  const deleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleDebtPaid = (id: string) => {
    setDebts((prev) => prev.map(d => d.id === id ? { ...d, isPaid: !d.isPaid } : d));
  };

  return (
    <FinanceContext.Provider value={{ 
      transactions, addTransaction, deleteTransaction,
      debts, addDebt, deleteDebt, toggleDebtPaid 
    }}>
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