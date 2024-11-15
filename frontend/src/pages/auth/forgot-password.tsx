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
import useAuth from '@/hooks/use-auth'
import { ForgotPasswordForm, forgotPasswordSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export default function ForgotPasswordPage() {
  const { requestPasswordReset, sendEmailCountdown } = useAuth()

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  })

  return (
    <main className='mx-auto flex w-full max-w-[350px] flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Reset Password</h2>
      <p className='text-center text-xl font-light text-muted-foreground'>
        Enter your email address to request a password reset
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(({ email }) =>
            requestPasswordReset(email)
          )}>
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
            disabled={sendEmailCountdown > 0}>
            {sendEmailCountdown > 0
              ? `Send Again (${sendEmailCountdown})`
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
