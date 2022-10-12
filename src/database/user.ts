import { database } from '../utils/firebase'
import type { User } from '../models/user'
import { ref, set, get, remove } from 'firebase/database'

export const insertUserIntoDatabase = async (user: User) => {
  const databaseReference = ref(database, `users/${user.uid}`)
  await set(databaseReference, user)
}

export const getUserFromDatabase = async (uid: string): Promise<User> => {
  const databaseReference = ref(database, `users/${uid}`)
  return (await (await get(databaseReference)).val()) as User
}
export const RemoveUserIntoDatabase = async user => {
  const databaseReference = ref(database, `users/${user}`)
  await remove(databaseReference)
}
