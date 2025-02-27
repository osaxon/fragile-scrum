import { setTheme } from '@/lib/set-theme'
import { GuestFields } from '@/schemas/auth-schema'
import { User, userSchema, userWithSettingsSchema } from '@/schemas/user-schema'
import { queryOptions } from '@tanstack/react-query'
import { pb } from './pocketbase'

export function checkUserIsLoggedIn() {
  return pb.authStore.isValid
}

export function checkEmailIsVerified() {
  return pb.authStore.model?.verified
}

export function checkVerifiedUserIsLoggedIn() {
  return checkUserIsLoggedIn() && checkEmailIsVerified()
}

export async function authRefresh() {
  if (!checkUserIsLoggedIn()) return
  await pb.collection('users').authRefresh({ requestKey: null })
}

export async function sendVerificationEmail(email: string) {
  await pb.collection('users').requestVerification(email)
}

export async function createNewUser(newUserData: {
  name: string
  email: string
  password: string
  passwordConfirm: string
}) {
  await pb.collection('users').create({ ...newUserData, emailVisibility: true })
  await sendVerificationEmail(newUserData.email)
}

export async function createGuestUser({ username }: GuestFields) {
  const tempPw = `${username}_${new Date().valueOf()}_${Math.random().toString(36).substring(2)}`

  const guestData = {
    username: username,
    password: tempPw,
    passwordConfirm: tempPw,
    name: username,
    isGuest: true
  }

  const newUser = await pb.collection('users').create(guestData)

  await pb.collection('users').authWithPassword(username, tempPw)

  return newUser
}

export async function verifyEmailByToken(token: string) {
  await pb.collection('users').confirmVerification(token, { requestKey: null })
  if (pb.authStore.record) await authRefresh()
}

export async function loginWithPassword(email: string, password: string) {
  const authResult = await pb
    .collection('users')
    .authWithPassword(email, password)
  return authResult
}

export async function loginWithGoogle() {
  const authResult = await pb
    .collection('users')
    .authWithOAuth2({ provider: 'google' })
  await authRefresh()
  return authResult
}

export async function loginWithGithub() {
  const authResult = await pb
    .collection('users')
    .authWithOAuth2({ provider: 'github' })
  await authRefresh()
  return authResult
}

export function logout() {
  pb.authStore.clear()
}

export async function requestPasswordReset(email: string) {
  await pb.collection('users').requestPasswordReset(email)
}

export async function confirmPasswordReset(
  password: string,
  passwordConfirm: string,
  token: string
) {
  await pb
    .collection('users')
    .confirmPasswordReset(token, password, passwordConfirm)
  if (pb.authStore.model)
    await loginWithPassword(pb.authStore.model.email, password)
}

export async function subscribeToUserChanges(
  userId: string,
  callback: (record: User) => void
) {
  try {
    pb.collection('users').subscribe(
      userId,
      (event) => {
        const userData = userSchema.parse(event.record)
        callback(userData)
      },
      {
        onError: (err: Error) =>
          console.error('Realtime user subscription error:', err)
      }
    )
  } catch (error) {
    console.error('Failed to subscribe to realtime user data:', error)
  }
}

export async function unsubscribeFromUserChanges() {
  pb.collection('users').unsubscribe('*')
}

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    if (!checkUserIsLoggedIn()) return null

    try {
      await authRefresh()
    } catch {
      logout()
      return null
    }

    const settings = await pb
      .collection('settings')
      .getFirstListItem(`user="${pb.authStore.model?.id}"`)

    setTheme(settings.theme)

    const userData = userWithSettingsSchema.parse({
      ...pb.authStore.record,
      settings
    })

    return userData
  },
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchInterval: false
})
