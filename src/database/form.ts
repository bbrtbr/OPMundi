import { database } from '../services/firebase'
import type { Form } from '../models/form'
import { ref, get } from 'firebase/database'

export const getFormsFromDatabase = async (): Promise<Form[]> => {
  const formsDatabaseReference = ref(database, 'forms')
  const forms: Form[] = []

  await get(formsDatabaseReference).then(formsFromDatabase => {
    formsFromDatabase.forEach(form => {
      forms.push(form.val())
    })
  })

  return forms
}
