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
import { VerifyEmailForm, verifyEmailSchema } from '@/schemas/auth-schema'
import {
  authRefresh,
  checkUserIsAuthenticated,
  userQueryOptions
} from '@/services/api-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function VerifyEmailPage() {
  const router = useRouter()
  const {
    sendEmailCountdown,
    sendVerificationEmail,
    verifyEmailByToken,
    logout
  } = useAuth()

  const userQuery = useSuspenseQuery(userQueryOptions)
  const user = userQuery.data

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
            Please check your inbox and click the registration link. An email
            was sent to:
          </p>
          <p className='text-xl font-light text-muted-foreground'>
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
        </form>
      </Form>
    </main>
  )
}
