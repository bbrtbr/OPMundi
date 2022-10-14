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
  stateInitials?: string
  stateName?: string
  city?: string
  district?: string
  expirationDate?: string
  macs?: string[]
  imeis?: string[]
  uids?: string[]
}
