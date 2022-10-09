import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { FirebaseStorage, getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAq59c56Kg6ugfA6_BhlS5PsHyLa3zR9II',
  authDomain: 'opmundi-75c82.firebaseapp.com',
  databaseURL: 'https://opmundi-75c82-default-rtdb.firebaseio.com',
  projectId: 'opmundi-75c82',
  storageBucket: 'opmundi-75c82.appspot.com',
  messagingSenderId: '714544241520',
  appId: '1:714544241520:web:6dce4331710771cf3d8db5'
}

initializeApp(firebaseConfig)

export const auth = getAuth()
export const database = getDatabase()
export const defaultStorage: FirebaseStorage = getStorage()
