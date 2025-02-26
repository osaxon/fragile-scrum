import { RoomMembers } from '@/schemas/room.schema'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('')
}

export default function RoomMembersList({
  members
}: {
  members?: RoomMembers
}) {
  if (!members) return null

  return (
    <div className='space-y-4 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>Room members</h3>
      <ul className='flex -space-x-2'>
        {members.map(({ name, avatar }) => (
          <Avatar key={name}>
            <AvatarImage src={avatar} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        ))}
      </ul>
    </div>
  )
}
