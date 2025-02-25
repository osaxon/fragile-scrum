import { errorToast } from '@/lib/toast'
import { Vote } from '@/schemas/votes.schema'
import { Button } from '../ui/button'

const scoreOptions = [0, 1, 2, 3, 5, 8, 13]

export default function VotingButtons({
  addVote,
  storyId,
  userId,
  lastVote
}: {
  addVote: (vote: Vote) => void
  storyId?: string
  userId: string
  lastVote?: Vote
}) {
  return (
    <div className='space-y-2'>
      <p className='font-bold'>Select your score</p>
      <ul className='flex gap-2'>
        {scoreOptions.map((val) => (
          <Button
            key={val}
            disabled={!storyId || (lastVote && lastVote.score === val)}
            variant='outline'
            size='icon'
            onClick={() => {
              if (!storyId) {
                errorToast('No story assigned to room')
                return
              }
              addVote({ score: val, user: userId, story: storyId })
            }}>
            {val.toString()}
          </Button>
        ))}
      </ul>
    </div>
  )
}
