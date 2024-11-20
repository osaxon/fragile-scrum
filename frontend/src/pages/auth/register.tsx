import InputField from '@/components/form/input-field'
import PasswordField from '@/components/form/password-field'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import useAuth from '@/hooks/use-auth'
import { RegisterFields, registerSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
  const { register } = useAuth()

  const form = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: ''
    }
  })

  return (
    <main className='mx-auto flex w-full max-w-[350px] flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Register</h2>
      <p className='text-center text-xl font-light text-muted-foreground'>
        Enter your details to create a new account
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(register)}>
          <InputField form={form} name='name' />
          <InputField form={form} name='email' type='email' />
          <PasswordField form={form} name='password' />
          <PasswordField
            form={form}
            name='passwordConfirm'
            label='Confirm password'
          />

          <Button className='mt-4 w-full' type='submit'>
            Register
          </Button>
        </form>
      </Form>
      <p className='text-sm'>
        Already have an account?{' '}
        <Link to='/login' className='text-primary'>
          Log in
        </Link>
      </p>
    </main>
  )
}
