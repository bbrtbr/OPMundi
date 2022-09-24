import React, { createContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'

import { auth } from '../services/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'

export const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async (email, password) => {
    setIsLoading(true)
    await signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user
        ToastAndroid.show('Login realizado com sucesso', ToastAndroid.SHORT)
        AsyncStorage.setItem('@user', JSON.stringify(user))
        setUser(user)
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          ToastAndroid.show('Email ou senha incorretos.', ToastAndroid.LONG)
        }
        if (error.code === 'auth/wrong-password') {
          ToastAndroid.show('Email ou senha incorretos.', ToastAndroid.LONG)
        } else {
          ToastAndroid.show(
            'Ocorreu um erro, tente novamente mais tarde.',
            ToastAndroid.LONG
          )
        }
      })

    setIsLoading(false)
  }

  const registerAccount = async (email, password) => {
    setIsLoading(true)
    await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user
        ToastAndroid.show('Registrado com sucesso', ToastAndroid.SHORT)
        setIsLoading(false)
        AsyncStorage.setItem('@user', JSON.stringify(user))
        setUser(user)
      })
      .catch(error => {
        setIsLoading(false)
        if (error.code === 'auth/email-already-in-use') {
          ToastAndroid.show('Esse email já foi utilizado.', ToastAndroid.LONG)
        }
        if (error.code === 'auth/weak-password') {
          ToastAndroid.show(
            'Essa senha não é forte, tente utilizar caracteres especiais (#,@,-,*).',
            ToastAndroid.LONG
          )
        }
        if (error.code === 'auth/invalid-email') {
          ToastAndroid.show('Email inválido.', ToastAndroid.LONG)
        } else {
          ToastAndroid.show(
            'Ocorreu um erro, tente novamente mais tarde.',
            ToastAndroid.LONG
          )
        }
      })
  }
  const signOut = async () => {
    await AsyncStorage.removeItem('@user')
    setUser(null)
  }

  useEffect(() => {
    async function getLocalUser() {
      const user = await AsyncStorage.getItem('@user')
      if (user) {
        setUser(JSON.parse(user))
      }
    }

    getLocalUser()
  }, [])

  return (
    <UserContext.Provider
      value={{
        registerAccount,
        user,
        signIn,
        signOut,
        isLoading
      }}
    >
      {children}
    </UserContext.Provider>
  )
}