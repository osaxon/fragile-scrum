import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import useSettings from '@/hooks/use-settings'
import useTasks from '@/hooks/use-tasks'
import { Task, taskSchema } from '@/schemas/task-schema'
import { userQueryOptions } from '@/services/api-auth'
import { getCategoryList } from '@/services/api-tasks'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import AutoCompleteField from './form/autocomplete-field'
import InputField from './form/input-field'
import SwitchField from './form/switch-field'
import TextAreaField from './form/text-area-field'

export default function TaskForm({
  selectedTask
}: {
  selectedTask?: Task | null | undefined
}) {
  const navigate = useNavigate()
  const { createTask, updateTask, deleteTask } = useTasks()
  const queryClient = useQueryClient()
  const userQuery = useSuspenseQuery(userQueryOptions)

  const { remindByEmailEnabled } = useSettings()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      const cachedTasks = queryClient.getQueryData<Task[]>(['tasks'])

      if (cachedTasks) {
        const categories = cachedTasks
          .map((task) => task.category)
          .filter((category): category is string => !!category)
        return [...new Set(categories)]
      }
      return getCategoryList()
    }
  })

  const form = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: selectedTask ? selectedTask.name : '',
      description: selectedTask ? selectedTask.description : '',
      category: selectedTask ? selectedTask.category : '',
      repeatGoalEnabled: selectedTask ? selectedTask.repeatGoalEnabled : false,
      daysRepeat: selectedTask ? selectedTask.daysRepeat : 7,
      daysRemind: (selectedTask && selectedTask.daysRemind) || '',
      remindByEmail: selectedTask ? selectedTask.remindByEmail : false,
      history: selectedTask ? selectedTask.history : []
    }
  })

  const fieldsEdited = form.formState.isDirty

  function onSubmit(values: Task) {
    if (!fieldsEdited) {
      navigate({ to: '/tasks' })
      return
    }

    if (selectedTask) {
      selectedTask.id && updateTask(selectedTask.id, values)
    } else {
      createTask(userQuery.data!.id, values)
    }
  }

  const pageTitle = `${selectedTask ? 'Edit' : 'New'} Task`

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-y-4'
        onSubmit={form.handleSubmit(onSubmit)}>
        <SheetHeader>
          <SheetTitle className='pb-4 text-4xl font-bold'>
            {pageTitle}
          </SheetTitle>
          <SheetDescription className='hidden'>{pageTitle}</SheetDescription>
        </SheetHeader>

        <InputField form={form} name='name' />

        <AutoCompleteField form={form} name='category' options={categories} />

        <TextAreaField form={form} name='description' />

        <SwitchField
          form={form}
          name='repeatGoalEnabled'
          label='Set goal to repeat regularly'
        />

        <InputField
          form={form}
          type='number'
          name='daysRepeat'
          label='Repeat every x days'
          disabled={!form.watch('repeatGoalEnabled')}
        />

        <SwitchField
          form={form}
          name='remindByEmail'
          label='Send reminders by email'
          disabled={!remindByEmailEnabled || !form.watch('repeatGoalEnabled')}
        />

        <InputField
          form={form}
          type='number'
          name='daysRemind'
          label='Remind every x days'
          disabled={
            !remindByEmailEnabled ||
            !form.watch('repeatGoalEnabled') ||
            !form.watch('remindByEmail')
          }
        />

        <FormField
          control={form.control}
          name='history'
          render={({ field }) => (
            <FormItem className='pb-4'>
              <FormLabel className='w-full text-center'>
                Dates Completed
              </FormLabel>
              <FormControl>
                <DatePicker value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className='flex items-center gap-4 sm:justify-between'>
          <Button type='submit' disabled={!fieldsEdited} className='w-full'>
            {selectedTask ? 'Update' : 'Create'}
          </Button>
          {selectedTask ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline' type='button' className='w-full'>
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent
                className='bg-card sm:max-w-[300px]'
                onKeyDown={(event) =>
                  event.key === 'Enter' && deleteTask(selectedTask)
                }>
                <DialogHeader>
                  <DialogTitle>Delete Task</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete the task &quot;
                    {selectedTask.name}&quot;?
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className='flex items-center gap-4 sm:justify-between'>
                  <DialogClose asChild>
                    <Button
                      type='button'
                      size='sm'
                      className='w-full'
                      variant='outline'>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    className='w-full'
                    size='sm'
                    variant='destructive'
                    onClick={() => deleteTask(selectedTask)}>
                    Delete{' '}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : (
            <Button asChild variant='outline' type='button' className='w-full'>
              <Link to='/tasks'>Cancel</Link>
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
