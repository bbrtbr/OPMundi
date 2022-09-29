import type { QuestionItem } from './questionItem'
import type { Answer } from './answer'

type Coverage = 'ALL' | 'SPECIFIC'

export interface Form {
  id: string
  creationDate: string
  question: string
  items: QuestionItem[]
  answers?: Answer[]
  coverage?: Coverage
  state?: string
  city?: string
  district?: string
  macs?: string[]
  imeis?: string[]
  uids?: string[]
}
