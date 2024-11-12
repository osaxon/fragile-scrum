import TaskForm from '@/components/task-form'
import { SheetContent } from '@/components/ui/sheet'
import { taskSchema } from '@/schemas/task-schema'
import { taskQueryOptions } from '@/services/api-tasks'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'

export default function EditTaskPage() {
  const { taskId } = useParams({ from: '/tasks/$taskId' })

  const taskQuery = useSuspenseQuery(taskQueryOptions(taskId))
  const task = taskSchema.parse(taskQuery.data)

  return (
    <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
      <TaskForm selectedTask={task} />
    </SheetContent>
  )
}
