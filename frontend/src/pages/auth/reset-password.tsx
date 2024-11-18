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
import { ResetPasswordFields, resetPasswordSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export default function ResetPasswordPage() {
  const { confirmPasswordReset } = useAuth()
  const navigate = useNavigate()

  const { token } = useSearch({ from: '/auth/reset-password' })

  const form = useForm<ResetPasswordFields>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: ''
    }
  })

  const handleSubmit = ({
    password,
    passwordConfirm
  }: {
    password: string
    passwordConfirm: string
  }) => {
    confirmPasswordReset(password, passwordConfirm, token)
  }

  if (!token) return navigate({ to: '/login' })

  return (
    <main className='mx-auto flex w-full max-w-[350px] flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Change Password</h2>
      <p className='text-center text-xl font-light text-muted-foreground'>
        Enter your new password
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>New password</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='passwordConfirm'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className='mt-4 w-full' type='submit'>
            Change Password
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
