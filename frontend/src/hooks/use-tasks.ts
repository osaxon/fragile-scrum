import { Task } from '@/schemas/task-schema'
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  updateTask as updateTaskApi
} from '@/services/api-tasks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export default function useTasks() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const createMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Task }) =>
      createTaskApi(userId, data),

    onSuccess: () => {
      navigate({ to: '/tasks' })
    },

    onError: (error) => {
      console.error(error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const createTask = (userId: string, taskData: Task) =>
    createMutation.mutate({ userId, data: taskData })

  const updateMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Task }) =>
      updateTaskApi(taskId, data),

    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      const previousTask = queryClient.getQueryData<Task[]>(['tasks', taskId])

      queryClient.setQueryData(['tasks'], (currentTasks: Task[]) => {
        return currentTasks.map((currentTask: Task) =>
          taskId === currentTask.id ? { ...currentTask, ...data } : currentTask
        )
      })

      queryClient.setQueryData(
        ['tasks', taskId],
        (currentTask: Task[] | undefined) => ({ ...currentTask, ...data })
      )

      return { previousTasks, previousTask }
    },

    onSuccess: () => {
      navigate({ to: '/tasks' })
    },

    onError: (error, variables, context) => {
      console.error(error)
      queryClient.setQueryData(['tasks'], context?.previousTasks)
      queryClient.setQueryData(
        ['tasks', variables.taskId],
        context?.previousTask
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const updateTask = (taskId: string, taskData: Task) =>
    updateMutation.mutate({ taskId, data: taskData })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTaskApi(taskId),

    onSuccess: () => {
      navigate({ to: '/tasks' })
    },

    onError: (error) => {
      console.error(error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const deleteTask = (taskId: string) => deleteMutation.mutate(taskId)

  return { createTask, updateTask, deleteTask }
}
