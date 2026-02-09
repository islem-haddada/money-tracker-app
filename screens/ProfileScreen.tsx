import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Image, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useFinance } from "../context/FinanceContext";
import { useAppTheme } from "../context/ThemeContext";

export default function ProfileScreen() {
  const { user, logout, changePassword, updateProfile, deleteAccount, loading, isOnline, syncWithServer } = useAuth();
  const { transactions, debts } = useFinance();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const router = useRouter();

  // Settings states
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Edit Modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    if (user) {
      setNewName(user.name || "");
      setNewEmail(user.email || "");
    }
  }, [user]);

  // Check current permissions on mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        try {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();
          if (!hasHardware || !isEnrolled) setBiometricEnabled(false);
        } catch (e) {
          console.log("Biometric check failed", e);
        }
      }
    })();
  }, []);

  // Handle Notification Toggle
  const toggleNotifications = async (value: boolean) => {
    Alert.alert(
      "Notifications",
      "Les notifications sont désactivées dans cette version Expo Go sur Android (SDK 53+)."
    );
    setNotifEnabled(false);
  };

  // Handle Biometric Toggle
  const toggleBiometric = async (value: boolean) => {
    if (Platform.OS === 'web') {
      Alert.alert("Info", "La biométrie n'est pas supportée sur le web.");
      return;
    }
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirmez votre identité',
        fallbackLabel: 'Utiliser le code PIN',
      });

      if (result.success) {
        setBiometricEnabled(true);
        Alert.alert("Succès", "Authentification biométrique activée");
      } else {
        setBiometricEnabled(false);
      }
    } else {
      setBiometricEnabled(false);
    }
  };

  // Calcul des statistiques
  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    const balance = totalIncome - totalExpenses;
    const activeDebts = debts.filter((d) => !d.isPaid).length;

    return { balance, activeDebts, totalExpenses };
  }, [transactions, debts]);

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/auth/Login");
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    if (loading) {
      Alert.alert("Attendez", "L'app est en cours de chargement...");
      return;
    }

    Alert.prompt(
      "Ancien mot de passe",
      "Veuillez entrer votre mot de passe actuel",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Suivant",
          onPress: (oldPass) => {
            if (!oldPass) return;
            Alert.prompt(
              "Nouveau mot de passe",
              "Entrez votre nouveau mot de passe (min 6 caractères)",
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Changer",
                  onPress: async (newPass) => {
                    if (newPass && newPass.length >= 6) {
                      const success = await changePassword(oldPass, newPass);
                      if (success) Alert.alert("Succès", "Mot de passe mis à jour !");
                    } else {
                      Alert.alert("Erreur", "Le nouveau mot de passe est trop court");
                    }
                  }
                }
              ],
              "secure-text"
            );
          }
        }
      ],
      "secure-text"
    );
  };

  const handleDeleteAccount = () => {
    if (loading) {
      Alert.alert("Attendez", "L'app est en cours de chargement...");
      return;
    }

    Alert.alert(
      "⚠ Suppression du compte",
      "Êtes-vous absolument sûr ? Cette action est irréversible et toutes vos données seront supprimées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer définitivement",
          style: "destructive",
          onPress: async () => {
            const success = await deleteAccount();
            if (success) {
              router.replace("/auth/Login");
            }
          }
        }
      ]
    );
  };

  const handleChangeAvatar = () => {
    Alert.alert("Changer la photo", "Cette fonctionnalité nécessite l'accès à votre galerie. Souhaitez-vous continuer ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Choisir une photo", onPress: () => Alert.alert("Info", "Simulateur: Image sélectionnée avec succès") }
    ]);
  };

  const handlePersonalInfos = () => {
    Alert.alert(
      "Informations personnelles",
      `Nom: ${user?.name || "Non défini"}\nEmail: ${user?.email}\nMembre depuis: Février 2026`,
      [
        { text: "Modifier", onPress: () => setEditModalVisible(true) },
        { text: "Fermer" }
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (!newName || !newEmail) {
      Alert.alert("Erreur", "Le nom et l'email sont obligatoires");
      return;
    }

    if (loading) {
      Alert.alert("Attendez", "L'app est en cours de chargement...");
      return;
    }

    console.log("handleUpdateProfile: Appel de updateProfile avec", { newName, newEmail });
    const success = await updateProfile(newName, newEmail);
    console.log("handleUpdateProfile: Résultat", success);
    if (success) {
      setEditModalVisible(false);
    }
  };

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.containerDark]} bounces={false}>
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>Modifier le profil</Text>
            
            <Text style={styles.inputLabel}>Nom complet</Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nom"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#999"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditModalVisible(false)} disabled={loading}>
                <Text style={styles.cancelBtnText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveBtn, loading && { opacity: 0.6 }]} onPress={handleUpdateProfile} disabled={loading}>
                <Text style={styles.saveBtnText}>{loading ? "Chargement..." : "Enregistrer"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LinearGradient colors={isDarkMode ? ["#1b5e20", "#000"] : ["#4caf50", "#1b5e20"]} style={styles.header}>
        {/* Online Status Badge */}
        <View style={[styles.onlineBadge, { backgroundColor: isOnline ? '#4caf50' : '#ff9800' }]}>
          <Ionicons name={isOnline ? "cloud-done" : "cloud-offline"} size={14} color="#fff" />
          <Text style={styles.onlineBadgeText}>{isOnline ? "En ligne" : "Hors ligne"}</Text>
        </View>
        
        <View style={styles.avatarContainer}>
          <Image
            source={{ 
              uri: `https://ui-avatars.com/api/?name=${user?.name || user?.email || "User"}&background=ffffff&color=4caf50&size=128&bold=true` 
            }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editBadge} onPress={handleChangeAvatar}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.name || user?.email?.split("@")[0] || "Utilisateur"}</Text>
        <Text style={styles.email}>{user?.email || "user@email.com"}</Text>
      </LinearGradient>

      <View style={styles.statsCardContainer}>
        <View style={[styles.statsCard, isDarkMode && styles.statsCardDark]}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Solde Total</Text>
            <Text style={[styles.statValue, isDarkMode && styles.statValueDark, { color: stats.balance >= 0 ? "#4caf50" : "#f44336" }]}>
              {stats.balance.toFixed(2)} €
            </Text>
          </View>
          <View style={[styles.statDivider, isDarkMode && styles.statDividerDark]} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Dettes Actives</Text>
            <Text style={[styles.statValue, isDarkMode && styles.statValueDark]}>{stats.activeDebts}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          <TouchableOpacity style={[styles.menuItem, isDarkMode && styles.menuItemDark]} onPress={handlePersonalInfos}>
            <View style={[styles.iconBox, { backgroundColor: "#e3f2fd" }]}>
              <Ionicons name="person-outline" size={20} color="#2196f3" />
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.menuTextDark]}>Informations personnelles</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences de l'application</Text>
          
          <View style={[styles.menuItem, isDarkMode && styles.menuItemDark]}>
            <View style={[styles.iconBox, { backgroundColor: "#f3e5f5" }]}>
              <Ionicons name="notifications-outline" size={20} color="#9c27b0" />
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.menuTextDark]}>Notifications Push</Text>
            <Switch 
              value={notifEnabled} 
              onValueChange={toggleNotifications}
              trackColor={{ false: "#eee", true: "#ce93d8" }}
              thumbColor={notifEnabled ? "#9c27b0" : "#f4f3f4"}
            />
          </View>

          <View style={[styles.menuItem, isDarkMode && styles.menuItemDark]}>
            <View style={[styles.iconBox, { backgroundColor: "#eceff1" }]}>
              <Ionicons name="moon-outline" size={20} color="#455a64" />
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.menuTextDark]}>Mode Sombre</Text>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleTheme}
              trackColor={{ false: "#eee", true: "#b0bec5" }}
              thumbColor={isDarkMode ? "#455a64" : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité & Compte</Text>
          
          {/* Sync Button */}
          <TouchableOpacity 
            style={[styles.menuItem, isDarkMode && styles.menuItemDark]} 
            onPress={syncWithServer}
          >
            <View style={[styles.iconBox, { backgroundColor: isOnline ? "#e3f2fd" : "#fafafa" }]}>
              <Ionicons name="sync-outline" size={20} color={isOnline ? "#2196f3" : "#9e9e9e"} />
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.menuTextDark]}>
              Synchroniser avec le serveur
            </Text>
            <View style={[styles.syncStatusDot, { backgroundColor: isOnline ? "#4caf50" : "#ff9800" }]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, isDarkMode && styles.menuItemDark]} onPress={handleChangePassword}>
            <View style={[styles.iconBox, { backgroundColor: "#fff3e0" }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#ff9800" />
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.menuTextDark]}>Changer le mot de passe</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>

          <View style={[styles.menuItem, isDarkMode && styles.menuItemDark]}>
            <View style={[styles.iconBox, { backgroundColor: "#e0f2f1" }]}>
              <Ionicons name="finger-print-outline" size={20} color="#009688" />
            </View>
            <Text style={[styles.menuText, isDarkMode && styles.menuTextDark]}>Authentification biométrique</Text>
            <Switch 
              value={biometricEnabled} 
              onValueChange={toggleBiometric}
              trackColor={{ false: "#eee", true: "#80cbc4" }}
              thumbColor={biometricEnabled ? "#009688" : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={[styles.menuItem, isDarkMode && styles.menuItemDark]} onPress={handleDeleteAccount}>
            <View style={[styles.iconBox, { backgroundColor: "#ffebee" }]}>
              <Ionicons name="trash-outline" size={20} color="#f44336" />
            </View>
            <Text style={[styles.menuText, { color: "#f44336" }]}>Supprimer mon compte</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutBtn, isDarkMode && styles.logoutBtnDark]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#f44336" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.1.0 • Made with ❤️</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  containerDark: {
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: 80,
    paddingBottom: 60,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1b5e20",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  statsCardContainer: {
    marginTop: -30,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  statsCardDark: {
    backgroundColor: "#1e1e1e",
    elevation: 0,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#f0f0f0",
  },
  statDividerDark: {
    backgroundColor: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statValueDark: {
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  menuItemDark: {
    backgroundColor: "#1e1e1e",
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  menuTextDark: {
    color: "#eee",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    padding: 15,
    backgroundColor: "#ffebee",
    borderRadius: 16,
  },
  logoutBtnDark: {
    backgroundColor: "#310000",
  },
  logoutText: {
    color: "#f44336",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  versionText: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
  },
  modalContentDark: {
    backgroundColor: "#1e1e1e",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    color: "#333",
  },
  inputDark: {
    backgroundColor: "#333",
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#4caf50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textDark: {
    color: "#fff",
  },
  onlineBadge: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    gap: 5,
  },
  onlineBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  syncStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
