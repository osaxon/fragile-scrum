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
  sendVerificationEmail,
  userQueryOptions,
  verifyEmailByToken
} from '@/services/api-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function VerifyEmailPage() {
  const router = useRouter()
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

  return (
    <div className='flex flex-col items-center gap-y-4'>
      <h3 className='text-3xl font-medium'>Verify Email</h3>
      <Form {...form}>
        <form
          className='flex w-full max-w-[350px] flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(onSubmit)}>
          <p className='text-center text-sm'>
            To complete registration you need to verify your email. Please click
            the link in the message sent to:
          </p>
          <h2 className='text-lg font-medium'>{user!.email ?? ''}</h2>
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
        </form>
      </Form>
    </div>
  )
}
