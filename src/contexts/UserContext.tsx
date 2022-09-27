import React, { FC, createContext, ReactNode, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'
import type { User } from '../models/user'
import { getUserFromDatabase, insertUserIntoDatabase } from '../database/user'
import { auth } from '../utils/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth'

export const UserContext = createContext(null)

interface UserContextProviderProps {
  children: ReactNode | ReactNode[]
}

export const UserContextProvider: FC<UserContextProviderProps> = ({
  children
}) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    await signInWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const userFromAuthCredential = userCredential.user
        const { uid } = userFromAuthCredential
        const user: User = await getUserFromDatabase(uid)
        ToastAndroid.show('Login realizado com sucesso', ToastAndroid.SHORT)
        AsyncStorage.setItem('@user', JSON.stringify(user))
        setUser(userFromAuthCredential)
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

  const registerAccount = async (
    email: string,
    password: string,
    name: string,
    phone: string,
    sex: string,
    state: string,
    city: string,
    district: string
  ) => {
    setIsLoading(true)
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const userFromAuthCredential = userCredential.user
        const { uid } = userFromAuthCredential
        const user: User = {
          uid,
          email,
          name,
          phone,
          sex,
          state,
          city,
          district
        }
        await insertUserIntoDatabase(user).then(async () => {
          setIsLoading(false)
          await AsyncStorage.setItem(
            '@user',
            JSON.stringify(userFromAuthCredential)
          )
          setUser(userFromAuthCredential)
          ToastAndroid.show('Registrado com sucesso', ToastAndroid.SHORT)
        })
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
        }
      })
  }

  const signOut = async () => {
    await AsyncStorage.removeItem('@user')
    setUser(null)
  }

  const resetPass = async email => {
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        ToastAndroid.show(
          'Email de recuperação enviado com sucesso.',
          ToastAndroid.LONG
        )
      })
      .catch(() => {
        ToastAndroid.show(
          'Ocorreu um erro, você realmente tem cadastro?',
          ToastAndroid.LONG
        )
      })
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
        isLoading,
        resetPass
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
