import { errorToast, successToast } from '@/lib/toast'
import { RegisterFields } from '@/schemas/auth-schema'
import { User, UserWithSettings } from '@/schemas/user-schema'
import {
  confirmPasswordReset as confirmPasswordResetApi,
  createNewUser,
  loginWithGoogle as loginWithGoogleApi,
  loginWithPassword as loginWithPasswordApi,
  logout as logoutApi,
  requestPasswordReset as requestPasswordResetApi,
  sendVerificationEmail as sendVerificationEmailApi,
  subscribeToUserChanges,
  unsubscribeFromUserChanges,
  verifyEmailByToken as verifyEmailByTokenApi
} from '@/services/api-auth'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export default function useAuth() {
  const [sendEmailCountdown, setSendEmailCountdown] = useState(0)
  const router = useRouter()
  const queryClient = useQueryClient()

  const logout = () => {
    logoutApi()
    queryClient.invalidateQueries({ queryKey: ['user'] })
    unsubscribeFromUserChanges()
    router.navigate({ to: '/' })
  }

  const subscribeUserChangeCallback = (record: User) => {
    router.invalidate()
    queryClient.setQueryData(['user'], record)
  }

  const loginWithPassword = async (email: string, password: string) => {
    try {
      const authResult = await loginWithPasswordApi(email, password)
      subscribeToUserChanges(authResult.record.id, subscribeUserChangeCallback)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.navigate({ to: '/tasks' })
    } catch (error) {
      errorToast('Could not log in', error)
    }
  }

  const loginWithGoogle = async () => {
    try {
      const authResult = await loginWithGoogleApi()
      subscribeToUserChanges(authResult.record.id, subscribeUserChangeCallback)
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.invalidate()
      router.navigate({ to: '/tasks' })
    } catch (error) {
      errorToast('Could not log in', error)
    }
  }

  const register = async (newUserData: RegisterFields) => {
    try {
      await createNewUser(newUserData)
      successToast(
        'Registration successful!',
        'Please check your inbox for a verification email'
      )
      router.navigate({ to: '/login' })
    } catch (error) {
      errorToast('Could not register', error)
    }
  }

  const resetSendEmailCountdown = () => {
    setSendEmailCountdown(60)
    const ticker = setInterval(() => {
      setSendEmailCountdown((current) => {
        if (current <= 0) {
          clearInterval(ticker)
          return 0
        } else {
          return current - 1
        }
      })
    }, 1000)
  }

  const requestPasswordReset = async (email: string) => {
    try {
      await requestPasswordResetApi(email)
      successToast(
        'Password reset email sent',
        'An email with password reset instructions has been sent to your inbox'
      )
      resetSendEmailCountdown()
    } catch (error) {
      errorToast('Could not send password reset email', error)
    }
  }

  const confirmPasswordReset = async (
    password: string,
    passwordConfirm: string,
    token: string
  ) => {
    try {
      await confirmPasswordResetApi(password, passwordConfirm, token)
      successToast('Changed password', 'Your password has been updated')
      router.navigate({ to: '/login' })
    } catch (error) {
      errorToast('Could not update password', error)
    }
  }

  const sendVerificationEmail = async (email: string | undefined) => {
    try {
      if (!email) throw new Error("Unable to get logged in user's email")
      await sendVerificationEmailApi(email)
      successToast(
        'Verification email sent',
        'Please check your inbox for a verification email'
      )
      resetSendEmailCountdown()
    } catch (error) {
      errorToast('Could not send verification email', error)
    }
  }

  const verifyEmailByToken = async (token: string) => {
    try {
      await verifyEmailByTokenApi(token)
      queryClient.setQueryData(['user'], (userData: UserWithSettings) =>
        userData
          ? {
              ...userData,
              verified: true
            }
          : userData
      )
      successToast(
        'Verification successful',
        'Your email address has been verified'
      )
      router.navigate({ to: '/login' })
    } catch (error) {
      errorToast('Could not verify email by token', error)
    }
  }

  return {
    logout,
    loginWithPassword,
    loginWithGoogle,
    register,
    requestPasswordReset,
    confirmPasswordReset,
    sendVerificationEmail,
    verifyEmailByToken,
    sendEmailCountdown
  }
}
