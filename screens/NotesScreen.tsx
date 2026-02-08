import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useNotes } from "../context/NotesContext";
import { useAppTheme } from "../context/ThemeContext";

const COLORS = ["#FFE5E5", "#E5F3FF", "#E5FFE5", "#FFF5E5", "#F0E5FF"];
const EMPTY_MESSAGE = "Aucune note pour le moment. Créez votre première note !";

export default function NotesScreen() {
  const { isDarkMode } = useAppTheme();
  const { notes, addNote, deleteNote, updateNote } = useNotes();
  const [input, setInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [selectedColor, setSelectedColor] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<"add" | "history">("add");

  const handleAddNote = () => {
    if (!input.trim() && !titleInput.trim()) {
      Alert.alert("Erreur", "Veuillez écrire une note");
      return;
    }

    if (editingId) {
      updateNote(editingId, {
        title: titleInput || "Note",
        content: input,
        color: COLORS[selectedColor],
      });
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: titleInput || "Note",
        content: input,
        date: new Date().toLocaleDateString("fr-FR"),
        color: COLORS[selectedColor],
      };
      addNote(newNote);
    }

    setInput("");
    setTitleInput("");
    setSelectedColor(0);
  };

  const handleEdit = (note: any) => {
    setTitleInput(note.title);
    setInput(note.content);
    setSelectedColor(COLORS.indexOf(note.color));
    setEditingId(note.id);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Supprimer", "Êtes-vous sûr?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => deleteNote(id),
      },
    ]);
  };

  const togglePin = (id: string) => {
    setIsPinned((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const bgColor = isDarkMode ? "#1A1A1A" : "#FFFFFF";
  const textColor = isDarkMode ? "#FFFFFF" : "#000000";
  const borderColor = isDarkMode ? "#333333" : "#EEEEEE";
  const inputBg = isDarkMode ? "#2A2A2A" : "#F5F5F5";
  const searchBg = isDarkMode ? "#2A2A2A" : "#F0F0F0";
  const headerGradient: [string, string] = isDarkMode
    ? ["#1e3c72", "#2a5298"]
    : ["#4CAF50", "#45a049"];

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((n) => isPinned[n.id]);
  const otherNotes = filteredNotes.filter((n) => !isPinned[n.id]);
  const sortedNotes = [...pinnedNotes, ...otherNotes];
  const hasSearch = searchQuery.trim().length > 0;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <LinearGradient colors={headerGradient} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>📝 Mes Notes</Text>
            <Text style={styles.headerSubtitle}>
              {hasSearch
                ? `${sortedNotes.length} résultat${sortedNotes.length > 1 ? "s" : ""}`
                : `${notes.length} note${notes.length > 1 ? "s" : ""}`}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.searchIconBtn, { backgroundColor: "rgba(255,255,255,0.3)" }]}
            onPress={() => {
              setShowSearch(!showSearch);
              setSearchQuery("");
            }}
          >
            <MaterialCommunityIcons
              name={showSearch ? "close" : "magnify"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {showSearch && (
          <TextInput
            style={[styles.searchInput, { backgroundColor: searchBg, color: textColor, borderColor }]}
            placeholder="Rechercher des notes..."
            placeholderTextColor={isDarkMode ? "#888888" : "#CCCCCC"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        )}
      </LinearGradient>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: isDarkMode ? "#0F0F0F" : "#F8F8F8" }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "add" && styles.tabActive, activeTab === "add" && { backgroundColor: "#4CAF50" }]}
          onPress={() => setActiveTab("add")}
        >
          <MaterialCommunityIcons
            name="plus-circle"
            size={20}
            color={activeTab === "add" ? "#FFFFFF" : isDarkMode ? "#888888" : "#999999"}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "add" ? "#FFFFFF" : isDarkMode ? "#888888" : "#999999" },
            ]}
          >
            Ajouter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.tabActive, activeTab === "history" && { backgroundColor: "#4CAF50" }]}
          onPress={() => setActiveTab("history")}
        >
          <MaterialCommunityIcons
            name="history"
            size={20}
            color={activeTab === "history" ? "#FFFFFF" : isDarkMode ? "#888888" : "#999999"}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === "history" ? "#FFFFFF" : isDarkMode ? "#888888" : "#999999" },
            ]}
          >
            Historique ({notes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "add" ? (
        <View style={[styles.inputSection, { borderBottomColor: borderColor }]}>
          <View style={styles.inputHeader}>
            <Text style={[styles.inputLabel, { color: textColor }]}>
              {editingId ? "✏️ Modifier note" : "✍️ Nouvelle note"}
            </Text>
            {editingId && (
              <TouchableOpacity
                onPress={() => {
                  setEditingId(null);
                  setInput("");
                  setTitleInput("");
                  setSelectedColor(0);
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color={textColor} />
              </TouchableOpacity>
            )}
          </View>

        <TextInput
          style={[
            styles.titleInput,
            {
              backgroundColor: inputBg,
              color: textColor,
              borderColor: borderColor,
            },
          ]}
          placeholder="Titre (optionnel)"
          placeholderTextColor={isDarkMode ? "#888888" : "#CCCCCC"}
          value={titleInput}
          onChangeText={setTitleInput}
        />

        <TextInput
          style={[
            styles.contentInput,
            {
              backgroundColor: inputBg,
              color: textColor,
              borderColor: borderColor,
            },
          ]}
          placeholder="Écrivez vos notes ici..."
          placeholderTextColor={isDarkMode ? "#888888" : "#CCCCCC"}
          value={input}
          onChangeText={setInput}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={[styles.colorLabel, { color: textColor }]}>Couleur :</Text>
        <View style={styles.colorPicker}>
          {COLORS.map((color, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === idx && styles.colorSelected,
              ]}
              onPress={() => setSelectedColor(idx)}
            >
              {selectedColor === idx && (
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color="#000000"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNote}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={editingId ? "pencil" : "plus"}
            size={24}
            color="white"
          />
          <Text style={styles.addButtonText}>
            {editingId ? "Mettre à jour" : "Ajouter"}
          </Text>
        </TouchableOpacity>
      </View>
      ) : (
        /* History Tab Content */
        <>
          {sortedNotes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="note-plus-outline"
                size={64}
                color={isDarkMode ? "#444444" : "#CCCCCC"}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: isDarkMode ? "#888888" : "#999999" },
                ]}
              >
                {EMPTY_MESSAGE}
              </Text>
            </View>
          ) : (
            <FlatList
              data={sortedNotes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
            <View
              style={[
                styles.noteCard,
                { backgroundColor: item.color || "#FFE5E5" },
                isPinned[item.id] && styles.pinnedCard,
              ]}
            >
              {isPinned[item.id] && (
                <View style={styles.pinnedBadge}>
                  <MaterialCommunityIcons name="pin" size={14} color="#FF9800" />
                </View>
              )}

              <View style={styles.noteHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text
                    style={[styles.noteTitle, { color: "#2C3E50" }]}
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <View style={styles.noteMetaRow}>
                    <MaterialCommunityIcons
                      name="calendar-outline"
                      size={12}
                      color="#7F8C8D"
                    />
                    <Text style={[styles.noteDate, { color: "#7F8C8D" }]}>
                      {item.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.iconButtonPin]}
                    onPress={() => togglePin(item.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name={isPinned[item.id] ? "pin" : "pin-outline"}
                      size={16}
                      color={isPinned[item.id] ? "#FF9800" : "#7F8C8D"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.iconButtonEdit]}
                    onPress={() => handleEdit(item)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="pencil"
                      size={16}
                      color="#2196F3"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.iconButton, styles.iconButtonDelete]}
                    onPress={() => handleDelete(item.id)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="delete-outline"
                      size={16}
                      color="#E74C3C"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: "rgba(0,0,0,0.08)" }]} />

              <Text
                style={[styles.noteContent, { color: "#34495E" }]}
                numberOfLines={6}
              >
                {item.content}
              </Text>

              <View style={styles.noteFooter}>
                <Text style={[styles.noteStats, { color: "#95A5A6" }]}>
                  {item.content.length} caractères
                </Text>
              </View>
            </View>
          )}
              contentContainerStyle={styles.listContent}
              scrollEnabled
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  searchIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    height: 44,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 14,
    fontSize: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: "transparent",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  tabActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  inputSection: {
    padding: 20,
    borderBottomWidth: 1,
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  titleInput: {
    height: 46,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  contentInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
    minHeight: 120,
  },
  colorLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingVertical: 14,
    borderRadius: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  colorSelected: {
    borderWidth: 4,
    borderColor: "#333333",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    height: 56,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 7,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  noteCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
  pinnedCard: {
    borderWidth: 2.5,
    borderColor: "#FF9800",
    opacity: 0.98,
  },
  pinnedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 152, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  noteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  noteMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  noteDate: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 6,
  },
  iconButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonPin: {
    backgroundColor: "rgba(255, 152, 0, 0.15)",
  },
  iconButtonEdit: {
    backgroundColor: "rgba(33, 150, 243, 0.15)",
  },
  iconButtonDelete: {
    backgroundColor: "rgba(231, 76, 60, 0.15)",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  noteContent: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "500",
    marginBottom: 10,
  },
  noteFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  noteStats: {
    fontSize: 12,
    fontWeight: "600",
  },
});
