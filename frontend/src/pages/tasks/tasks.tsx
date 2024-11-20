import Spinner from '@/components/spinner'
import { TasksTable } from '@/components/tasks-table'
import { Sheet } from '@/components/ui/sheet'
import { userQueryOptions } from '@/services/api-auth'
import { tasksQueryOptions } from '@/services/api-tasks'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { Suspense } from 'react'

export default function TasksPage() {
  const { data: tasks } = useSuspenseQuery(tasksQueryOptions)
  const userQuery = useSuspenseQuery(userQueryOptions)
  const verifiedUserIsLoggedIn = userQuery?.data?.verified
  const navigate = useNavigate()

  return (
    <main className='flex flex-col gap-8 text-justify text-lg'>
      {verifiedUserIsLoggedIn && tasks && <TasksTable tasks={tasks} />}
      <Sheet open={true} onOpenChange={() => navigate({ to: '/tasks' })}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Sheet>
    </main>
  )
}
