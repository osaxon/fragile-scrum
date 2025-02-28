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
    <div className='col-span-full space-y-4 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>Select your score</h3>
      <ul className='flex flex-wrap justify-center gap-2 md:justify-start'>
        {scoreOptions.map((val) => (
          <Button
            key={val}
            disabled={!storyId || (lastVote && lastVote.score === val)}
            variant='outline'
            size='lg'
            className='disabled:border-2 disabled:border-teal-500'
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
