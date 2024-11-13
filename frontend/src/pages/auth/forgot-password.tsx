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
import { requestPasswordReset } from '@/services/api-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function ForgotPasswordPage() {
  const [emailTimeout, setEmailTimeout] = useState(0)

  const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email')
  })
  type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
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

  const onSubmit = async ({ email }: ForgotPasswordForm) => {
    try {
      await requestPasswordReset(email)
      successToast(
        'Password reset email sent',
        'An email with password reset instructions has been sent to your inbox'
      )
      resetSendEmailCountdown()
    } catch (error) {
      errorToast('Could not send password reset email', error)
    }
  }

  return (
    <main className='mx-auto flex w-full max-w-[350px] flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Reset Password</h2>
      <p className='text-xl text-center font-light text-muted-foreground'>
        Enter your email address to request a password reset
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Email</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className='mt-4 w-full'
            type='submit'
            disabled={emailTimeout > 0}>
            {emailTimeout > 0
              ? `Send Again (${emailTimeout})`
              : 'Request Reset'}
          </Button>
        </form>
      </Form>

      <p className='text-sm'>
        Back to{' '}
        <Link to='/login' className='text-primary'>
          login
        </Link>
      </p>
    </main>
  )
}
