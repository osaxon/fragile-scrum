import JoinRoomDialog from '@/components/rooms/join-room-dialog'
import RoomControls from '@/components/rooms/room-controls'
import RoomMembersList from '@/components/rooms/room-members'
import RoomStatus from '@/components/rooms/room-status'
import StoriesTable from '@/components/rooms/stories-table'
import VotingButtons from '@/components/rooms/voting-buttons'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/use-auth'
import useVotingRoom from '@/hooks/use-room'
import { redirect } from '@tanstack/react-router'
import { useMemo } from 'react'

export default function RoomPage() {
  const { user } = useAuth()

  const { room, roomActions, isUserJoined, joinRoom } = useVotingRoom()

  const isAuthenticated = !!user?.id

  const lastVote = useMemo(
    () => room.votes?.find((v) => v.user === user?.id),
    [room.votes, user?.id]
  )

  if (!isAuthenticated) {
    throw redirect({
      to: '/rooms/$roomId/join',
      params: {
        roomId: room.id
      }
    })
  }

  return (
    <main className='space-y-6'>
      <JoinRoomDialog isUserJoined={isUserJoined(user.id)}>
        <p>Welcome back, {user.name}</p>
        <Button onClick={() => joinRoom(user.id)}>Join</Button>
      </JoinRoomDialog>
      <div className='grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2'>
        <h2 className='col-span-full text-xl font-bold'>
          Room: {room.name} - User story: {room.activeStory?.name}
        </h2>
        <RoomStatus {...room} />
        <RoomMembersList {...room} />
        <VotingButtons
          addVote={roomActions.addVote}
          storyId={room.activeStory?.id}
          userId={user.id}
          lastVote={lastVote}
        />

        {user.id === room.user ? (
          <RoomControls
            {...roomActions}
            roomId={room.id}
            activeStory={room.activeStory}
            stories={room.stories}
          />
        ) : (
          <StoriesTable {...room} />
        )}
      </div>
    </main>
  )
}
