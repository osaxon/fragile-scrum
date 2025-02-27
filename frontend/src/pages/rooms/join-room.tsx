import GuestForm from '@/components/rooms/guest-form'
import { Link, useParams } from '@tanstack/react-router'

export default function JoinRoom() {
  const { roomId } = useParams({ from: '/rooms/$roomId/join' })
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4'>
      <div className='w-full max-w-md space-y-6 rounded-lg border p-6 shadow-md'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold'>Guest Sign up</h1>

          <p className='text-sm'>
            Create a guest account to participate in this session
          </p>
        </div>

        <GuestForm roomId={roomId} />

        <div className='flex gap-1 border-t pt-2 text-sm'>
          <p>Already have an account?</p>
          <Link to='/login' className='font-medium text-teal-600'>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
