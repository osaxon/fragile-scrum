import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import useAuth from '@/hooks/use-auth'
import { guestAccountSchema, GuestFields } from '@/schemas/auth-schema'
import { joinRoom } from '@/services/api-rooms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function GuestForm({ roomId }: { roomId: string }) {
  const { signUpAsGuest } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useForm<GuestFields>({
    resolver: zodResolver(guestAccountSchema),
    defaultValues: {
      username: ''
    }
  })

  async function onSubmit(values: GuestFields) {
    try {
      const newUser = await signUpAsGuest(values)

      await joinRoom(roomId, newUser.id)

      await queryClient.invalidateQueries({ queryKey: ['room', roomId] })
      navigate({ to: '/rooms/$roomId', params: { roomId } })
    } catch (error) {
      console.error('Failed to complete the join process', error)
    }
  }

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <div>
                <FormLabel>Username</FormLabel>
                <FormMessage className='text-xs font-normal' />
              </div>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type='submit'>Sign up</Button>
      </form>
    </Form>
  )
}
