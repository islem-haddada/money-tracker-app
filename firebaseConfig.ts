// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBI8QySd8lW_rsCQBaRBKVgSROfdmfKkFQ",
  authDomain: "moneytracker-47795.firebaseapp.com",
  projectId: "moneytracker-47795",
  storageBucket: "moneytracker-47795.appspot.com",
  messagingSenderId: "745518974009",
  appId: "1:745518974009:web:7b46f370687c7551c139e8"
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
