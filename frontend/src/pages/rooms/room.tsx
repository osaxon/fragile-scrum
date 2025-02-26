import RoomControls from '@/components/rooms/room-controls'
import RoomMembersList from '@/components/rooms/room-members'
import VotingButtons from '@/components/rooms/voting-buttons'
import useAuth from '@/hooks/use-auth'
import useVotingRoom from '@/hooks/use-room'
import { Vote } from '@/schemas/votes.schema'

export default function RoomPage() {
  const { user } = useAuth()

  const { room, addVote, votes, members, displayResults } = useVotingRoom()

  if (!user) return null

  console.log(
    votes
      ?.sort((a, b) => (a.created < b.created ? 1 : -1))
      .find((v) => v.user === user.id),
    'last vote'
  )

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <h2 className='col-span-full text-xl font-bold'>
        {room.activeStory?.name}
      </h2>
      <VotingButtons
        addVote={addVote}
        storyId={room.activeStory?.id}
        userId={user.id}
        lastVote={votes?.find((v) => v.user === user.id)}
      />
      <RoomStatus displayResults={room.displayResults} votes={votes} />

      <RoomMembersList members={members} />

      {user.id === room.user ? (
        <RoomControls
          displayResults={() => displayResults(room.id, room.displayResults)}
          activeStory={room.activeStory}
          stories={room.stories}
        />
      ) : null}
    </div>
  )
}

function RoomStatus({
  displayResults,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  votes
}: {
  displayResults: boolean
  votes?: Vote[]
}) {
  return (
    <div className='space-y-4 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>Room status</h3>
      {displayResults ? (
        <p>results here</p>
      ) : (
        <div>
          <p className='text-muted-foreground animate-pulse'>
            Voting in progress
          </p>
          <div className='text-muted-foreground flex gap-2'>
            <p>Votes:</p>
            <p>{votes?.length}</p>
          </div>
        </div>
      )}
    </div>
  )
}
