import { cn } from '@/lib/shadcn'
import { RoomExpanded } from '@/schemas/room.schema'
import { CircleCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
}

export default function RoomMembersList({ members, votes }: RoomExpanded) {
  if (!members) return null

  return (
    <div className='space-y-4 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>Room members</h3>
      <ul className='flex -space-x-2'>
        {members.map(({ name, avatar, id }) => {
          const hasVoted = votes?.find((v) => v.user === id)
          return (
            <div key={name} className='flex flex-col items-center'>
              <Avatar className='relative'>
                <AvatarImage
                  data-voted={hasVoted}
                  className={cn(
                    'border-2 border-slate-300/50 data-voted:border-green-500'
                  )}
                  src={avatar}
                />
                <AvatarFallback
                  data-voted={hasVoted}
                  className={cn(
                    'border-2 border-slate-300/50 data-voted:border-green-500'
                  )}>
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              {hasVoted ? (
                <CircleCheck
                  data-voted={hasVoted}
                  className='w-5 -translate-y-3 fill-black text-green-500'
                />
              ) : null}
            </div>
          )
        })}
      </ul>
    </div>
  )
}
