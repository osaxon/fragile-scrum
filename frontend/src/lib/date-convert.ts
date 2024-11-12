import { taskHistoryDateSchema } from '@/schemas/task-schema'
import { addDays, format, isValid } from 'date-fns'

export function stringToDate(dateString: string) {
  const parsedDateString = taskHistoryDateSchema.parse(dateString)
  const date = new Date(parsedDateString)
  date.setHours(12, 0, 0, 0)
  return date
}

export function dateToString(date: Date = new Date()) {
  if (!(date instanceof Date) || !isValid(date))
    throw new Error('Invalid Date object provided')

  return format(date, 'yyyy-MM-dd')
}

export const getNextDueDate = (history: string[], daysRepeat: number) => {
  const lastCompleteDate = history?.length
    ? stringToDate(history[0])
    : new Date().setHours(12, 0, 0, 0)

  return addDays(lastCompleteDate, daysRepeat)
}
