import { PbId } from '@/schemas/pb-schema'
import {
  Task,
  TaskHistoryDate,
  taskListSchema,
  taskSchema
} from '@/schemas/task-schema'
import { queryOptions } from '@tanstack/react-query'
import { newPb } from './pocketbase'

export async function getAllTasks() {
  const pb = newPb()
  const tasks = await pb.collection('tasks').getFullList()
  return taskListSchema.parse(tasks)
}

export async function getTaskById(taskId: PbId) {
  const pb = newPb()
  const task = await pb.collection('tasks').getOne(taskId)
  return taskSchema.parse(task)
}

export async function createTask(userId: PbId, data: Task) {
  const pb = newPb()
  return pb.collection('tasks').create({ ...data, user: userId })
}

export async function updateTask(taskId: PbId, data: Task) {
  const pb = newPb()
  return pb.collection('tasks').update(taskId, data)
}

export async function updateTaskHistory(
  taskId: PbId,
  history: TaskHistoryDate[]
) {
  const pb = newPb()
  return pb.collection('tasks').update(taskId, { history })
}

export async function deleteTask(taskId: PbId) {
  const pb = newPb()
  return pb.collection('tasks').delete(taskId)
}

export const tasksQueryOptions = queryOptions({
  queryKey: ['tasks'],
  queryFn: () => getAllTasks()
})

export const taskQueryOptions = (taskId: string) =>
  queryOptions({
    queryKey: ['tasks', taskId],
    queryFn: () => getTaskById(taskId)
  })
