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
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Name</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
              </FormItem>
            )}
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
