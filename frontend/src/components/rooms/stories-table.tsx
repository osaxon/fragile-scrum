import { RoomExpanded } from '@/schemas/room.schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'

export default function StoriesTable({ stories, activeStory }: RoomExpanded) {
  return (
    <div className='col-span-full space-y-4 rounded-md border p-4'>
      <h3 className='text-lg font-bold'>User stories</h3>
      <Table className=''>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Name</TableHead>
            <TableHead className='text-right'>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories
            ?.filter((s) => s.id !== activeStory.id)
            .map((story) => (
              <TableRow key={story.id}>
                <TableCell className='font-medium'>{story.name}</TableCell>
                <TableCell className='text-right'>
                  {story.score && story.score > 0 ? story.score : 'TBC'}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
