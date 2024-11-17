import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useAuth from '@/hooks/use-auth'
import { VerifyEmailFields, verifyEmailSchema } from '@/schemas/auth-schema'
import { userQueryOptions } from '@/services/api-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export default function VerifyEmailPage() {
  const {
    sendEmailCountdown,
    sendVerificationEmail,
    verifyEmailByToken,
    logout
  } = useAuth()

  const userQuery = useSuspenseQuery(userQueryOptions)
  const user = userQuery.data

  const params = useSearch({ from: '/auth/verify-email' })
  const token = (params && params.token) || ''

  const form = useForm<VerifyEmailFields>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token }
  })

  if (token) return void verifyEmailByToken(token)

  return (
    <main className='mx-auto flex w-full max-w-[350px] flex-col items-center gap-y-4'>
      <h2 className='mt-4 text-4xl font-bold'>Verify Email</h2>
      <p className='text-xl font-light text-muted-foreground'>
        Complete your registration
      </p>
      <Form {...form}>
        <form
          className='flex w-full flex-col items-center gap-y-4'
          onSubmit={form.handleSubmit(({ token }) =>
            verifyEmailByToken(token)
          )}>
          <p className='text-center text-sm'>
            Check your inbox and click the registration link.
          </p>
          {user?.email && (
            <p className='text-center text-sm'>
              An email was sent to:{' '}
              <span className='text-primary'>{user.email}</span>{' '}
            </p>
          )}
          <p className='text-center text-sm'>
            Or enter the verification token into the field below:
          </p>
          <FormField
            control={form.control}
            name='token'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className='mt-4 w-full' type='submit'>
            Verify Using Token
          </Button>
          {user ? (
            <>
              <Button
                className='w-full'
                variant='outline'
                type='button'
                disabled={sendEmailCountdown > 0}
                onClick={() => sendVerificationEmail(user?.email)}>
                {sendEmailCountdown > 0
                  ? `Send Again (${sendEmailCountdown})`
                  : 'Resend Email'}
              </Button>
              <Button
                type='button'
                variant='link'
                className='w-full hover:no-underline'
                onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <p className='text-sm'>
              Back to{' '}
              <Link to='/login' className='text-primary'>
                log in
              </Link>
            </p>
          )}
        </form>
      </Form>
    </main>
  )
}
