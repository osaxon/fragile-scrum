import useAuth from '@/hooks/use-auth'
import { Task } from '@/schemas/task-schema'
import { EnvelopeClosedIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

export default function TaskColumnDisplay({ row }: { row: Row<Task> }) {
  const { user } = useAuth()
  const globalRemindByEmailEnabled = !!user?.settings?.remindByEmailEnabled
  const repeatGoalEnabled = row.original.repeatGoalEnabled
  const taskName: string = row.getValue('name')
  const daysRepeat = row.original.daysRepeat
  const remindByEmail = row.original.remindByEmail

  return (
    <div>
      <p className='text-left text-sm font-light text-muted-foreground'>
        {taskName}
      </p>
      <p className='flex items-center gap-1 text-xs'>
        {repeatGoalEnabled
          ? `every ${daysRepeat} day${daysRepeat === 1 ? '' : 's'}`
          : 'no goal'}
        {globalRemindByEmailEnabled && remindByEmail && (
          <EnvelopeClosedIcon className='size-2.5 text-muted-foreground' />
        )}
      </p>
    </div>
  )
}
