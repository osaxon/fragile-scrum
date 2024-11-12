import { dateToString } from '@/lib/date-convert'
import { updateTaskHistory } from '@/services/api-tasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Task, TaskHistoryDate } from '../schemas/task-schema'
import { Checkbox } from './ui/checkbox'

export function TaskDone({ task }: { task: Task }) {
  const queryClient = useQueryClient()
  const today = dateToString()
  const doneToday = task.history?.includes(today)

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedHistory: TaskHistoryDate[]) =>
      updateTaskHistory(task.id!, updatedHistory),

    onMutate: async (newHistory) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      const previousTask = queryClient.getQueryData<Task[]>(['tasks', task.id])

      queryClient.setQueryData(['tasks'], (currentTasks: Task[] | undefined) =>
        currentTasks
          ? currentTasks.map((currentTask) =>
              currentTask.id === task.id
                ? { ...currentTask, history: newHistory }
                : currentTask
            )
          : []
      )

      previousTask &&
        queryClient.setQueryData(
          ['tasks', task.id],
          (currentTask: Task[] | undefined) => ({
            ...currentTask,
            history: newHistory
          })
        )

      return { previousTasks, previousTask }
    },

    onError: (error, _, context) => {
      console.error(error)
      queryClient.setQueryData(['tasks'], context?.previousTasks)
      queryClient.setQueryData(['tasks', task.id], context?.previousTask)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const handleCheck = (checked: boolean) => {
    const history = task.history || []
    const updatedHistory = checked
      ? [...new Set([today, ...history])]
      : history.filter((date) => date !== today)

    updateTaskMutation.mutate(updatedHistory)
  }

  return (
    <Checkbox
      checked={doneToday}
      className='ml-2 size-4'
      aria-label='Mark done'
      onCheckedChange={handleCheck}
      onClick={(e) => e.stopPropagation()}
    />
  )
}
