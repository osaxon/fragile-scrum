import { RoomExpanded } from '@/schemas/room.schema'
import StoryMetrics from './story-metrics'

export default function RoomStatus({
  displayResults,
  activeStory,
  votes
}: RoomExpanded) {
  return (
    <div className='space-y-4 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>Room status</h3>
      {displayResults && activeStory?.id ? (
        <StoryMetrics storyId={activeStory.id} />
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
