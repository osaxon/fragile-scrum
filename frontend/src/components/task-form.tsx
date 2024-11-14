import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Task, taskSchema } from '@/schemas/task-schema'
import { userQueryOptions } from '@/services/api-auth'
import { createTask, deleteTask, updateTask } from '@/services/api-tasks'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTrigger } from '@radix-ui/react-dialog'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { Textarea } from './ui/textarea'

export default function TaskForm({
  selectedTask
}: {
  selectedTask?: Task | null | undefined
}) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const userQuery = useSuspenseQuery(userQueryOptions)
  const user = userQuery.data

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

  const updateMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Task }) =>
      updateTask(taskId, data),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] })
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
      const previousTask = queryClient.getQueryData<Task[]>([
        'tasks',
        selectedTask!.id
      ])

      queryClient.setQueryData(['tasks'], (currentTasks: Task[]) => {
        return currentTasks.map((currentTask: Task) =>
          selectedTask!.id === currentTask.id
            ? { ...currentTask, ...newData }
            : currentTask
        )
      })

      queryClient.setQueryData(
        ['tasks', selectedTask!.id],
        (currentTask: Task[] | undefined) => ({ ...currentTask, ...newData })
      )

      return { previousTasks, previousTask }
    },

    onSuccess: () => {
      navigate({ to: '/tasks' })
    },

    onError: (error, _, context) => {
      console.error(error)
      queryClient.setQueryData(['tasks'], context?.previousTasks)
      queryClient.setQueryData(
        ['tasks', selectedTask!.id],
        context?.previousTask
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const createMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Task }) =>
      createTask(userId, data),

    onSuccess: () => {
      navigate({ to: '/tasks' })
    },

    onError: (error) => {
      console.error(error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),

    onSuccess: () => {
      navigate({ to: '/tasks' })
    },

    onError: (error) => {
      console.error(error)
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })

  function onSubmit(values: Task) {
    if (!fieldsEdited) {
      navigate({ to: '/tasks' })
      return
    }

    if (selectedTask) {
      selectedTask.id &&
        updateMutation.mutate({ taskId: selectedTask.id, data: values })
    } else {
      createMutation.mutate({ userId: user!.id, data: values })
    }
  }

  const pageTitle = `${selectedTask ? 'Edit' : 'New'} Task`

  return (
    <>
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
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Name</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Description</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Textarea rows={3} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Category</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='daysRepeat'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Repeat every x days</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input type='number' min={1} step={1} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='daysRemind'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-baseline justify-between'>
                  <FormLabel>Remind every x days</FormLabel>
                  <FormMessage className='text-xs font-normal' />
                </div>
                <FormControl>
                  <Input type='number' min={1} step={1} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='remindByEmail'
            render={({ field }) => (
              <FormItem className='flex items-center gap-x-2 py-1'>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='!mt-0 cursor-pointer'>
                  Send reminders by email
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
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
            <Button
              type='submit'
              disabled={!fieldsEdited}
              className='w-full sm:w-32'>
              {selectedTask ? 'Update' : 'Create'}
            </Button>
            {selectedTask && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='outline' className='w-full sm:w-32'>
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-[300px] bg-card'>
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
                        className='w-full'
                        variant='outline'>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      className='w-full'
                      variant='destructive'
                      onClick={() => deleteMutation.mutate(selectedTask.id!)}>
                      Delete                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </SheetFooter>
        </form>
      </Form>
    </>
  )
}
