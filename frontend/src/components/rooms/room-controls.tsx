import { Story } from '@/schemas/story.schema'
import { Button } from '../ui/button'

export default function RoomControls({
  activeStory,
  stories,
  displayResults
}: {
  activeStory?: Story
  stories?: Story[]
  displayResults: () => void
}) {
  return (
    <div className='col-span-full space-y-4 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>Room controls</h3>
      <div className='space-x-2'>
        <Button variant='secondary'>Add Story</Button>
        <Button onClick={displayResults}>Show Results</Button>
        <Button variant='outline'>End Round</Button>
        <Button variant='destructive'>End Room</Button>
      </div>
      <div className='space-y-1'>
        <p className='font-semibold'>Current story</p>
        <p>{activeStory ? activeStory.name : 'Not set'}</p>
      </div>
      <div className='space-y-1'>
        <p className='font-semibold'>Up next</p>
        <ul>
          {stories &&
            stories.length &&
            stories
              .filter((s) => s.id !== activeStory?.id)
              .map((story) => (
                <li
                  key={story.id}
                  className='flex list-none items-center gap-2'>
                  {story.name}
                </li>
              ))}
        </ul>
      </div>
    </div>
  )
}
