import React, { FC, createContext, ReactNode, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'
import type { User } from '../models/user'
import {
  getUserFromDatabase,
  insertUserIntoDatabase,
  RemoveUserIntoDatabase
} from '../database/user'
import { auth } from '../utils/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  deleteUser
} from 'firebase/auth'

export const UserContext = createContext(null)

interface UserContextProviderProps {
  children: ReactNode | ReactNode[]
}

export const UserContextProvider: FC<UserContextProviderProps> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    await signInWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const userFromAuthCredential = userCredential.user
        if (userCredential.user.emailVerified === true) {
          const { uid } = userFromAuthCredential
          const user: User = await getUserFromDatabase(uid)
          ToastAndroid.show('Login realizado com sucesso', ToastAndroid.SHORT)
          AsyncStorage.setItem('@user', JSON.stringify(user))
          setUser(user)
        } else {
          await sendEmailVerification(userCredential.user)
          ToastAndroid.show(
            'Email não validado, verifique seu email na sua caixa de entrada/spam.',
            ToastAndroid.SHORT
          )
        }
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
    district: string,
    birthDate: string
  ) => {
    setIsLoading(true)
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async userCredential => {
        const userFromAuthCredential = userCredential.user
        const { uid } = userFromAuthCredential
        await sendEmailVerification(userCredential.user)
        const user: User = {
          uid,
          email,
          name,
          phone,
          sex,
          state,
          city,
          district,
          birthDate
        }
        await insertUserIntoDatabase(user).then(async () => {
          setIsLoading(false)

          ToastAndroid.show(
            'Registrado!, confirme seu email na sua caixa de entrada/spam.',
            ToastAndroid.SHORT
          )
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
    await auth.signOut()
    await AsyncStorage.removeItem('@user')
    setUser(null)
  }

  const deleteAccount = async () => {
    const user = auth.currentUser
    const idbackup = user.uid

    await deleteUser(user)
      .then(async () => {
        RemoveUserIntoDatabase(idbackup)
        ToastAndroid.show('Conta excluida', ToastAndroid.LONG)
        await auth.signOut()
        await AsyncStorage.removeItem('@user')
        setUser(null)
      })
      .catch(error => {
        if (error.code === 'auth/requires-recent-login') {
          ToastAndroid.show(
            'Você precisa fazer login novamente para excluir a sua conta.',
            ToastAndroid.LONG
          )
          signOut()
        }
      })
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
        resetPass,
        deleteAccount
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
