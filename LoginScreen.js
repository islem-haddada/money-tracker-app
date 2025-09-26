import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user, setUser] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "TON_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "TON_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "TON_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "TON_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then((res) => {
        setUser(res.user);
      });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {user ? (
        <Text>Bienvenue {user.displayName}</Text>
      ) : (
        <Button
          disabled={!request}
          title="Se connecter avec Google"
          onPress={() => promptAsync()}
        />
      )}
    </View>
  );
}
