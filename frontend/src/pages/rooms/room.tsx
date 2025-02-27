import JoinRoomDialog from '@/components/rooms/join-room-dialog'
import RoomControls from '@/components/rooms/room-controls'
import RoomMembersList from '@/components/rooms/room-members'
import RoomStatus from '@/components/rooms/room-status'
import VotingButtons from '@/components/rooms/voting-buttons'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/use-auth'
import useVotingRoom from '@/hooks/use-room'

export default function RoomPage() {
  const { user } = useAuth()

  const { room, addVote, displayResults, isUserJoined, joinRoom } =
    useVotingRoom()

  if (!user) return null

  return (
    <main className='space-y-6'>
      <JoinRoomDialog isUserJoined={isUserJoined(user.id)}>
        <p>Welcome back, {user.name}</p>
        <p>
          {room.id} {user.id}
        </p>
        <Button onClick={() => joinRoom(room.id, user.id)}>Join</Button>
      </JoinRoomDialog>
      <div className='grid grid-cols-1 gap-4 transition-opacity md:grid-cols-2'>
        <h2 className='col-span-full text-xl font-bold md:col-span-1'>
          Room: {room.name} - User story: {room.activeStory?.name}
        </h2>
        <VotingButtons
          addVote={addVote}
          storyId={room.activeStory?.id}
          userId={user.id}
          lastVote={room.votes?.find((v) => v.user === user.id)}
        />

        <RoomStatus {...room} />
        <RoomMembersList {...room} />

        {user.id === room.user ? (
          <RoomControls
            displayResults={() => displayResults(room.id, room.displayResults)}
            activeStory={room.activeStory}
            stories={room.stories}
          />
        ) : null}
      </div>
    </main>
  )
}
