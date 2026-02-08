import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
  color?: string;
};

type NotesContextType = {
  notes: Note[];
  addNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
};

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  // Charger les notes au démarrage
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem("notes");
        if (storedNotes) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (err) {
        console.error("Erreur load notes:", err);
      }
    };
    loadNotes();
  }, []);

  // Sauvegarder les notes à chaque changement
  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem("notes", JSON.stringify(notes));
      } catch (err) {
        console.error("Erreur save notes:", err);
      }
    };
    saveNotes();
  }, [notes]);

  const addNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates } : n))
    );
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote, updateNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
};
