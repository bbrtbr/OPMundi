import type { QuestionItem } from './questionItem'

export interface Answer extends QuestionItem {
  name: string
  replyDate: string
}
