import { Checkbox } from '@/components/ui/checkbox'
import useTasks from '@/hooks/use-tasks'
import { dateToString } from '@/lib/date-convert'
import { Task } from '@/schemas/task-schema'

export function TaskDone({ task }: { task: Task }) {
  const today = dateToString()
  const doneToday = task.history?.includes(today)

  const { updateTaskHistory } = useTasks()

  const handleCheck = (checked: boolean) => {
    const history = task.history || []
    const updatedHistory = checked
      ? [...new Set([today, ...history])]
      : history.filter((date) => date !== today)

    updateTaskHistory(task.id!, updatedHistory)
  }

  return (
    <Checkbox
      checked={doneToday}
      className='mx-2 size-4'
      aria-label='Mark done'
      onCheckedChange={handleCheck}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
