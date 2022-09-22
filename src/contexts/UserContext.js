import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastAndroid } from "react-native";

import { auth } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email, password) => {
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        ToastAndroid.show("Login realizado com sucesso", ToastAndroid.SHORT);
        AsyncStorage.setItem("@user", JSON.stringify(user));
        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        ToastAndroid.show("Usuario e/ou senhas inválidos", ToastAndroid.SHORT);
        console.log(errorMessage);
      });

    setIsLoading(false);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("@user");
    setUser(null);
  };

  useEffect(() => {
    async function getLocalUser() {
      const user = await AsyncStorage.getItem("@user");
      if (user) {
        setUser(JSON.parse(user));
      }
    }

    getLocalUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};