import TaskForm from '@/components/task-form'
import { SheetContent } from '@/components/ui/sheet'

export default function NewTaskPage() {
  return (
    <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
      <TaskForm />
    </SheetContent>
  )
}
