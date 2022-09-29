import { database } from '../utils/firebase'
import type { Answer } from '../models/answer'
import { ref, update, push } from 'firebase/database'

export const updateAnswerInDatabase = async (
  formId: string,
  uid: string,
  answer: Answer
) => {
  const formAnswerReference = ref(database, `forms/${formId}/answers/${uid}`)
  const userAnswerReference = ref(database, `users/${uid}/answeredForms`)

  const updatedAnswer: Answer = { ...answer }
  if (!answer.imageUrl) {
    delete updatedAnswer.imageUrl
  }

  await update(formAnswerReference, updatedAnswer)
  await push(userAnswerReference, formId)
}
