// firebaseConfig.ts
import Constants from "expo-constants";
import { initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI8QySd8lW_rsCQBaRBKVgSROfdmfKkFQ",
  authDomain: "moneytracker-47795.firebaseapp.com",
  projectId: "moneytracker-47795",
  storageBucket: "moneytracker-47795.appspot.com",
  messagingSenderId: "745518974009",
  appId: "1:745518974009:web:7b46f370687c7551c139e8"
};

const app = initializeApp(firebaseConfig);

let auth: Auth;

// If running inside Expo Go, avoid initializeAuth (native persistence not supported there)
if (Constants?.appOwnership === "expo") {
  // Expo Go: use web-compatible getAuth
  // console.debug("firebaseConfig: running in Expo Go - using getAuth(app)");
  auth = getAuth(app);
} else {
  // Try to initialize native persistence when available (enables persistence on dev-client/standalone)
  try {
    // dynamic require to avoid bundler/type errors when module is unavailable
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rnAuth = require("firebase/auth/react-native");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    if (rnAuth && typeof rnAuth.getReactNativePersistence === "function" && AsyncStorage) {
      // console.debug("firebaseConfig: initializing native auth with AsyncStorage");
      auth = initializeAuth(app, {
        persistence: rnAuth.getReactNativePersistence(AsyncStorage),
      });
    } else {
      // console.debug("firebaseConfig: native persistence helpers not available - falling back to getAuth");
      auth = getAuth(app);
    }
  } catch (e) {
    // Fallback to default web-compatible auth (when native modules unavailable)
    // console.warn("firebaseConfig: failed to initialize native persistence", e);
    auth = getAuth(app);
  }
}

export { auth };

