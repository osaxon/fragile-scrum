import { Tasks } from '@/components/tasks'
import { Sheet } from '@/components/ui/sheet'
import { userQueryOptions } from '@/services/api-auth'
import { tasksQueryOptions } from '@/services/api-tasks'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Outlet, useNavigate } from '@tanstack/react-router'

export default function TasksPage() {
  const tasksQuery = useSuspenseQuery(tasksQueryOptions)
  const tasks = tasksQuery.data

  const userQuery = useSuspenseQuery(userQueryOptions)
  const userIsAuthenticated = userQuery?.data?.verified

  const navigate = useNavigate()

  return (
    <section className='flex flex-col gap-8 text-justify text-lg'>
      {userIsAuthenticated && tasks && <Tasks tasks={tasks} />}
      <Sheet open={true} onOpenChange={() => navigate({ to: '/tasks' })}>
        <Outlet />
      </Sheet>
    </section>
  )
}
