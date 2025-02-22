import NotFoundPage from '@/pages/not-found'
import RootLayout from '@/root-layout'
import { taskQueryOptions, tasksQueryOptions } from '@/services/api-tasks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
  RouterProvider,
  useMatches
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useEffect } from 'react'
import Spinner from './components/shared/spinner'
import { setTheme } from './lib/set-theme'
import ForgotPasswordPage from './pages/auth/forgot-password'
import LoginPage from './pages/auth/login'
import RegisterPage from './pages/auth/register'
import ResetPasswordPage from './pages/auth/reset-password'
import VerifyEmailPage from './pages/auth/verify-email'
import ErrorPage from './pages/error'
import HomePage from './pages/home'
import PrivacyPolicyPage from './pages/privacy-policy'
import NewRoomPage from './pages/rooms/new-room'
import RoomPage from './pages/rooms/room'
import RoomsPage from './pages/rooms/rooms'
import EditTaskPage from './pages/tasks/edit-task'
import NewTaskPage from './pages/tasks/new-task'
import SettingsPage from './pages/tasks/settings'
import TasksPage from './pages/tasks/tasks'
import {
  resetPasswordParamsSchema,
  verifyEmailParamsSchema
} from './schemas/auth-schema'
import { pbIdSchema } from './schemas/pb-schema'
import {
  checkEmailIsVerified,
  checkUserIsLoggedIn,
  checkVerifiedUserIsLoggedIn,
  userQueryOptions
} from './services/api-auth'
import { roomsQueryOptions } from './services/api-rooms'

interface RootContext {
  queryClient: QueryClient
  getTitle?: () => string | Promise<string>
}

function RootLayoutWithTitle() {
  const matches = useMatches()

  useEffect(() => {
    const breadcrumbPromises = [...matches]
      .reverse()
      .map((match) => {
        const context = match.context as RootContext
        return context.getTitle?.()
      })
      .filter(Boolean)

    void Promise.all(breadcrumbPromises).then((titles) => {
      document.title = titles.join(' · ')
    })
  }, [matches])

  return <RootLayout />
}

const rootRoute = createRootRouteWithContext<RootContext>()({
  component: RootLayoutWithTitle,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(userQueryOptions),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = queryClient.getQueryData(userQueryOptions.queryKey)
    setTheme(user?.settings?.theme)
    return { getTitle: () => 'Fragile Scrum' }
  }
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
  pendingComponent: Spinner,
  beforeLoad: async () => {
    if (checkVerifiedUserIsLoggedIn()) throw redirect({ to: '/tasks' })
    return { getTitle: () => '' }
  }
})

const privacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy-policy',
  component: PrivacyPolicyPage,
  pendingComponent: Spinner,
  beforeLoad: () => {
    return { getTitle: () => 'Privacy Policy' }
  }
})

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  beforeLoad: ({ location }) => {
    if (location.pathname.includes('reset-password')) return
    if (checkVerifiedUserIsLoggedIn()) throw redirect({ to: '/tasks' })
    return { getTitle: () => '' }
  }
})

const loginRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'login',
  component: LoginPage,
  beforeLoad: () => {
    if (checkUserIsLoggedIn() && !checkEmailIsVerified())
      throw redirect({ to: '/verify-email' })
    return { getTitle: () => 'Login' }
  }
})

const registerRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'register',
  component: RegisterPage,
  beforeLoad: () => {
    if (checkUserIsLoggedIn() && !checkEmailIsVerified())
      throw redirect({ to: '/verify-email' })
    return { getTitle: () => 'Register' }
  }
})

const verifyEmailRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'verify-email',
  component: VerifyEmailPage,
  validateSearch: verifyEmailParamsSchema,
  beforeLoad: () => {
    return { getTitle: () => 'Verify Email' }
  }
})

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'forgot-password',
  component: ForgotPasswordPage,
  beforeLoad: () => {
    if (checkUserIsLoggedIn() && !checkEmailIsVerified())
      throw redirect({ to: '/verify-email' })
    return { getTitle: () => 'Forgot Password' }
  }
})

const resetPasswordRoute = createRoute({
  getParentRoute: () => authRoute,
  path: 'reset-password',
  component: ResetPasswordPage,
  validateSearch: resetPasswordParamsSchema,
  beforeLoad: () => ({ getTitle: () => 'Reset Password' })
})

const tasksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'tasks',
  component: TasksPage,
  pendingComponent: Spinner,
  beforeLoad: () => {
    if (!checkVerifiedUserIsLoggedIn()) throw redirect({ to: '/login' })
    return { getTitle: () => 'Tasks' }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(tasksQueryOptions)
})

const roomsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'rooms',
  component: RoomsPage,
  pendingComponent: Spinner,
  beforeLoad: () => {
    if (!checkVerifiedUserIsLoggedIn()) throw redirect({ to: '/login' })
    return { getTitle: () => 'Rooms' }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(roomsQueryOptions)
})

const roomRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'rooms/$roomId',
  component: RoomPage
})

const newRoomRoute = createRoute({
  getParentRoute: () => roomsRoute,
  path: 'new',
  component: NewRoomPage,
  beforeLoad: () => {
    return { getTitle: () => 'New' }
  }
})

const settingsRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: 'settings',
  component: SettingsPage,
  beforeLoad: () => ({ getTitle: () => 'Settings' })
})

const newTaskRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: 'new',
  component: NewTaskPage,
  beforeLoad: () => {
    return { getTitle: () => 'New' }
  }
})

const editTaskRoute = createRoute({
  getParentRoute: () => tasksRoute,
  path: '$taskId',
  component: EditTaskPage,
  beforeLoad: () => {
    return { getTitle: () => 'Edit' }
  },
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    const taskIdValidationResult = pbIdSchema.safeParse(taskId)
    if (taskIdValidationResult.error) throw redirect({ to: '/tasks' })
    const task = await queryClient.ensureQueryData(
      taskQueryOptions(taskIdValidationResult.data)
    )
    return task
  }
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  privacyPolicyRoute,
  authRoute.addChildren([
    loginRoute,
    registerRoute,
    verifyEmailRoute,
    forgotPasswordRoute,
    resetPasswordRoute
  ]),
  tasksRoute.addChildren([settingsRoute, newTaskRoute, editTaskRoute]),
  roomsRoute.addChildren([newRoomRoute]),
  roomRoute
])

const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: { queryClient },
  scrollRestoration: true
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function Router({
  devToolsEnabled
}: {
  devToolsEnabled?: boolean
}) {
  devToolsEnabled ??= process.env.NODE_ENV === 'development'

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {devToolsEnabled && (
        <>
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition='bottom-left'
          />
          <TanStackRouterDevtools router={router} position='bottom-right' />
        </>
      )}
    </QueryClientProvider>
  )
}
