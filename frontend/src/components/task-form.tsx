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
import useTasks from '@/hooks/use-tasks'
import { Task, taskSchema } from '@/schemas/task-schema'
import { userQueryOptions } from '@/services/api-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import InputField from './form/input-field'
import SwitchField from './form/switch-field'

export default function TaskForm({
  selectedTask
}: {
  selectedTask?: Task | null | undefined
}) {
  const navigate = useNavigate()
  const { createTask, updateTask, deleteTask } = useTasks()

  const userQuery = useSuspenseQuery(userQueryOptions)

  const form = useForm<Task>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: selectedTask ? selectedTask.name : '',
      description: selectedTask ? selectedTask.description : '',
      category: selectedTask ? selectedTask.category : '',
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
        <InputField form={form} name='description' />
        <InputField form={form} name='category' />
        <InputField
          form={form}
          type='number'
          name='daysRepeat'
          label='Repeat every x days'
        />

        <SwitchField
          form={form}
          name='remindByEmail'
          label='Send reminders by email'
        />

        <InputField
          form={form}
          type='number'
          name='daysRemind'
          label='Remind every x days'
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
