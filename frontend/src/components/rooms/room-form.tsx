import useAuth from '@/hooks/use-auth'
import useRooms from '@/hooks/use-rooms'
import { cn } from '@/lib/shadcn'
import { Room, roomSchema } from '@/schemas/room-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { RefreshCcwIcon } from 'lucide-react'
import { generateSlug } from 'random-word-slugs'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet'

export default function RoomForm() {
  const { user } = useAuth()
  const { createRoom } = useRooms()

  const form = useForm<Room>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: generateSlug(2),
      user: user?.id
    }
  })

  function onSubmit(values: Room) {
    console.log(values)
    createRoom(values)
  }

  function regenerateName(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    form.setValue('name', generateSlug(2))
  }

  const pageTitle = 'New Room'

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-y-4'
        onSubmit={form.handleSubmit(onSubmit)}>
        <SheetHeader>
          <SheetTitle className='pb-4 text-4xl font-bold'>
            {pageTitle}
          </SheetTitle>
        </SheetHeader>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <div className='flex items-baseline justify-between'>
                <FormLabel>Room Name</FormLabel>
                <FormMessage className='text-xs font-normal' />
              </div>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={(e) => regenerateName(e)}>
                <RefreshCcwIcon />
              </Button>
            </FormItem>
          )}
        />
        <SheetFooter className='mt-4 grid w-full grid-cols-2 gap-4 sm:space-x-0'>
          <Button type='submit' className={cn('w-full', 'col-span-2')}>
            Add Room
          </Button>
          <Button
            asChild
            variant='secondary'
            type='button'
            className='col-span-2 w-full'>
            <Link to='/rooms' preload={false}>
              Cancel
            </Link>
          </Button>
        </SheetFooter>
      </form>
    </Form>
  )
}
