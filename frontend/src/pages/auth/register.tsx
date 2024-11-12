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
import { RegisterFields, registerSchema } from '@/schemas/auth-schema'
import { createNewUser } from '@/services/api-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
  const navigate = useNavigate()

  const form = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: ''
    }
  })

  const onSubmit = async (newUserData: RegisterFields) => {
    try {
      await createNewUser(newUserData)
      successToast(
        'Registration successful!',
        'Please check your inbox for a verification email'
      )
      navigate({ to: '/login' })
    } catch (error) {
      errorToast('Could not register', error)
    }
  }

  return (
    <div className='flex flex-col items-center gap-y-4'>
      <h3 className='text-3xl font-medium'>Register</h3>
      <p className='text-sm'>
        Already have an account?{' '}
        <Link to='/login' className='text-primary'>
          Log in
        </Link>
      </p>
      <Form {...form}>
        <form
          className='flex w-full max-w-[350px] flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(onSubmit)}>
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
    </div>
  )
}
