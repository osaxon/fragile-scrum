import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { errorToast, successToast } from '@/lib/toast'
import { VerifyEmailForm, verifyEmailSchema } from '@/schemas/auth-schema'
import {
  authRefresh,
  checkUserIsAuthenticated,
  logout,
  sendVerificationEmail,
  unsubscribeFromUserChanges,
  userQueryOptions,
  verifyEmailByToken
} from '@/services/api-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function VerifyEmailPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const userQuery = useSuspenseQuery(userQueryOptions)
  const user = userQuery.data
  const [emailTimeout, setEmailTimeout] = useState(0)

  useEffect(() => {
    const ticker = setInterval(async () => {
      await authRefresh()
      if (!checkUserIsAuthenticated()) return
      clearInterval(ticker)
      router.invalidate()
    }, 5000)

    return () => clearInterval(ticker)
  }, [])

  const form = useForm<VerifyEmailForm>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      token: ''
    }
  })

  const resetSendEmailCountdown = () => {
    setEmailTimeout(60)
    const ticker = setInterval(() => {
      setEmailTimeout((current) => {
        if (current <= 0) {
          clearInterval(ticker)
          return 0
        } else {
          return current - 1
        }
      })
    }, 1000)
  }

  const onResendVerificationEmail = async () => {
    try {
      if (!user?.email) throw new Error("Unable to get logged in user's email")
      await sendVerificationEmail(user.email)
      successToast(
        'Verification email sent',
        'Please check your inbox for a verification email'
      )
      resetSendEmailCountdown()
    } catch (error) {
      errorToast('Could not send verification email', error)
    }
  }

  const onSubmit = async ({ token }: VerifyEmailForm) => {
    try {
      await verifyEmailByToken(token)
      successToast(
        'Verification successful',
        'Your email address has been verified'
      )
      router.navigate({ to: '/login' })
    } catch (error) {
      errorToast('Could not verify email by token', error)
    }
  }

  const handleLogout = () => {
    logout()
    queryClient.invalidateQueries({ queryKey: ['user'] })
    unsubscribeFromUserChanges()
    router.navigate({ to: '/' })
  }

  return (
    <main className='mx-auto flex w-full max-w-[350px] flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Verify Email</h2>
      <p className='text-xl font-light text-muted-foreground'>
        Complete your registration
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(onSubmit)}>
          <p className='text-center text-sm'>
            Please check your inbox and click the registration link. An email
            was sent to:
          </p>
          <p className='text-xl font-light text-muted-foreground '>
            {user?.email ?? ''}
          </p>
          <p className='text-center text-sm'>
            Or enter the verification token into the field below:
          </p>
          <FormField
            control={form.control}
            name='token'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Verification Token</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className='mt-4 w-full' type='submit'>
            Verify Using Token
          </Button>
          <Button
            className='w-full'
            variant='outline'
            type='button'
            disabled={emailTimeout > 0}
            onClick={onResendVerificationEmail}>
            {emailTimeout > 0 ? `Send Again (${emailTimeout})` : 'Resend Email'}
          </Button>
          <Button
            type='button'
            variant='link'
            className='w-full hover:no-underline'
            onClick={handleLogout}>
            Log out
          </Button>
        </form>
      </Form>
    </main>
  )
}
