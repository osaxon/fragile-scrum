import InputField from '@/components/form/input-field'
import PasswordField from '@/components/form/password-field'
import { GoogleLogo } from '@/components/shared/logos'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useAuth from '@/hooks/use-auth'
import { LoginFields, loginSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export default function LoginPage() {
  const { loginWithPassword, loginWithGoogle } = useAuth()

  const form = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <main className='mx-auto flex w-full max-w-[350px] flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Log In</h2>
      <p className='text-center text-xl font-light text-muted-foreground'>
        Sign in to your account
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(({ email, password }) =>
            loginWithPassword(email, password)
          )}>
          <InputField form={form} name='email' type='email' />
          <PasswordField form={form} name='password' />

          <Link to='/forgot-password' className='ml-auto text-sm text-primary'>
            Forgot password
          </Link>
          <Button
            className='w-full'
            type='submit'
            disabled={!form.formState.isValid}>
            Login
          </Button>
          <Button
            className='w-full'
            variant='secondary'
            type='button'
            onClick={loginWithGoogle}>
            <GoogleLogo />
            Sign In with Google
          </Button>
        </form>
      </Form>
      <p className='text-sm'>
        Don&apos;t have an account?{' '}
        <Link to='/register' className='text-primary'>
          Register
        </Link>
      </p>
    </main>
  )
}
