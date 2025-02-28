import { Story, storySchema } from '@/schemas/story.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChartLineIcon, TrashIcon } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Toggle } from '../ui/toggle'

export default function RoomControls({
  roomId,
  activeStory,
  stories,
  toggleResults,
  setActiveStory,
  addStories
}: {
  roomId: string
  activeStory?: Story
  stories?: Story[]
  toggleResults: () => void
  setActiveStory: (storyId: string) => void
  addStories: (stories: Story[]) => void
}) {
  return (
    <div className='col-span-full space-y-4 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>Room controls</h3>
      <div className='flex justify-between space-x-2'>
        <Toggle aria-label='toggle-results' onPressedChange={toggleResults}>
          <ChartLineIcon />
        </Toggle>
        <div className='space-x-2'>
          <Button variant='outline'>End Round</Button>
          <Button variant='destructive'>End Room</Button>
        </div>
      </div>
      <div className='mt-6 space-y-4'>
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='font-medium'>Up Next</h3>
          {activeStory && (
            <div className='text-sm'>
              Current: <span className='font-medium'>{activeStory.name}</span>
            </div>
          )}
        </div>
        {stories && stories?.length > 0 ? (
          <ul className='max-h-64 space-y-2 overflow-y-auto'>
            {stories
              .filter((story) => story.id !== activeStory?.id)
              .map((story) => (
                <li key={story.id}>
                  <button
                    className='group flex w-full items-center rounded border px-3 py-2 text-left transition-colors'
                    onClick={() => story.id && setActiveStory(story.id)}>
                    <span className='font-medium group-hover:text-teal-500'>
                      {story.name}
                    </span>
                    <span className='ml-auto text-xs group-hover:text-teal-500'>
                      Start →
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        ) : (
          <div className='py-6 text-center text-gray-500 italic'>
            No more stories in the queue
          </div>
        )}
        <NewStoriesForm roomId={roomId} addStories={addStories} />
      </div>
    </div>
  )
}

const addStoriesSchema = z.object({
  stories: z.array(storySchema)
})

function NewStoriesForm({
  roomId,
  addStories
}: {
  roomId: string
  addStories: (stories: Story[]) => void
}) {
  const form = useForm<z.infer<typeof addStoriesSchema>>({
    resolver: zodResolver(addStoriesSchema),
    defaultValues: {
      stories: [
        {
          name: '',
          room: roomId
        }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'stories'
  })

  const onSubmit = (data: z.infer<typeof addStoriesSchema>) => {
    addStories(data.stories)
  }

  return (
    <Form {...form}>
      <h3 className='font-medium'>Add more stories</h3>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((item, index) => (
          <div key={item.id} className='flex items-end gap-2'>
            <FormField
              control={form.control}
              name={`stories.${index}.name`}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormControl>
                    <Input placeholder='Enter story name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='button'
              size='icon'
              variant='ghost'
              onClick={() => remove(index)}>
              <TrashIcon />
            </Button>
          </div>
        ))}

        <div className='flex gap-4'>
          <Button type='submit'>Save</Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => append({ name: '', room: roomId })}>
            + Add another
          </Button>
        </div>
      </form>
    </Form>
  )
}
