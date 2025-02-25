import RoomMembersList from '@/components/rooms/room-members'
import VotingButtons from '@/components/rooms/voting-buttons'
import useAuth from '@/hooks/use-auth'
import useVotingRoom from '@/hooks/use-room'

export default function RoomPage() {
  const { user } = useAuth()

  const { room, addVote, votes, members } = useVotingRoom()

  if (!user) return null

  return (
    <div className='space-y-6'>
      <RoomMembersList members={members} />
      <VotingButtons
        addVote={addVote}
        storyId={room.activeStory}
        userId={user.id}
        lastVote={votes?.find((v) => v.user === user.id)}
      />
    </div>
  )
}
