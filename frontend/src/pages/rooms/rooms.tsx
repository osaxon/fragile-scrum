import { RoomsTable } from '@/components/rooms/rooms-table'
import Spinner from '@/components/shared/spinner'
import { Sheet } from '@/components/ui/sheet'
import useRooms from '@/hooks/use-rooms'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { Suspense } from 'react'

export default function RoomsPage() {
  const { rooms } = useRooms()
  const navigate = useNavigate()

  return (
    <main className='flex flex-col gap-8 text-justify text-lg'>
      <RoomsTable rooms={rooms} />
      <Sheet open={true} onOpenChange={() => navigate({ to: '/rooms' })}>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </Sheet>
    </main>
  )
}
