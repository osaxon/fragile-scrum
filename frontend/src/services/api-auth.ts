import { setTheme } from '@/lib/set-theme'
import { User, userWithSettingsSchema } from '@/schemas/user-schema'
import { queryOptions } from '@tanstack/react-query'
import { newPb } from './pocketbase'

export async function authRefresh() {
  const pb = newPb()
  await pb.collection('users').authRefresh()
}

export function checkUserIsAuthenticated() {
  const pb = newPb()
  return pb.authStore.isValid && pb.authStore.model?.verified
}

export function checkUserIsLoggedIn() {
  const pb = newPb()
  return pb.authStore.isValid
}

export function checkEmailIsVerified() {
  const pb = newPb()
  return pb.authStore.model?.verified
}

export async function createNewUser(newUserData: {
  name: string
  email: string
  password: string
  passwordConfirm: string
}) {
  const pb = newPb()
  await pb.collection('users').create({ ...newUserData, emailVisibility: true })
  await pb.collection('users').requestVerification(newUserData.email)
}

export async function sendVerificationEmail(email: string) {
  const pb = newPb()
  await pb.collection('users').requestVerification(email)
}

export async function verifyEmailByToken(token: string) {
  const pb = newPb()
  await pb.collection('users').confirmVerification(token)
  await pb.collection('users').authRefresh()
}

export async function loginWithPassword(email: string, password: string) {
  const pb = newPb()
  const authResult = await pb
    .collection('users')
    .authWithPassword(email, password)
  return authResult
}

export async function loginWithGoogle() {
  const pb = newPb()
  const authResult = await pb
    .collection('users')
    .authWithOAuth2({ provider: 'google' })
  await pb.collection('users').authRefresh()
  return authResult
}

export function logout() {
  const pb = newPb()
  pb.authStore.clear()
}

export async function requestPasswordReset(email: string) {
  const pb = newPb()
  await pb.collection('users').requestPasswordReset(email)
}

export async function subscribeToUserChanges(
  userId: string,
  callback: (record: User) => void
) {
  const pb = newPb()
  pb.collection('users').subscribe(userId, (e) => {
    const userData = e.record as unknown as User
    callback(userData)
  })
}

export async function unsubscribeFromUserChanges() {
  const pb = newPb()
  pb.collection('users').unsubscribe('*')
}

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: async () => {
    const pb = newPb()
    if (!pb.authStore.isValid) return null

    try {
      await pb.collection('users').authRefresh()
    } catch {
      pb.authStore.clear()
      return null
    }

    const settings = await pb
      .collection('settings')
      .getFirstListItem(`user="${pb.authStore.model?.id}"`)

    setTheme(settings.theme)

    const userData = userWithSettingsSchema.parse({
      ...pb.authStore.model,
      settings
    })

    return userData
  }
})
