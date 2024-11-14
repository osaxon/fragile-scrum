import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
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
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { errorToast, successToast } from '@/lib/toast'
import {
  UpdateUserSettingsFields,
  updateUserSettingsSchema
} from '@/schemas/user-schema'
import {
  logout,
  unsubscribeFromUserChanges,
  userQueryOptions
} from '@/services/api-auth'
import { updateUserSettings } from '@/services/api-settings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

export default function SettingsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const formRef = useRef<HTMLFormElement>(null)

  const { data, isLoading } = useSuspenseQuery(userQueryOptions)

  const { name, id: userId, settings, authWithPasswordAvailable } = data ?? {}
  const remindEmail = settings?.remindEmail ?? ''
  const remindByEmailEnabled = settings?.remindByEmailEnabled

  const handleLogout = () => {
    logout()
    queryClient.invalidateQueries({ queryKey: ['user'] })
    unsubscribeFromUserChanges()
    navigate({ to: '/' })
  }

  const form = useForm<UpdateUserSettingsFields>({
    resolver: zodResolver(updateUserSettingsSchema),
    defaultValues: {
      name,
      theme: settings?.theme || 'system',
      remindEmail,
      remindByEmailEnabled,
      oldPassword: '',
      password: '',
      passwordConfirm: ''
    }
  })

  const fieldsEdited = form.formState.isDirty

  const onSubmit = async (userData: UpdateUserSettingsFields) => {
    try {
      if (!userId) throw new Error('invalid user')
      await updateUserSettings(userId, userData)
      successToast('Success!', 'Account details were updated successfully')
      navigate({ to: '/tasks' })
    } catch (error) {
      console.error(error)
      errorToast('Could not update account details', error)
    }
  }

  return (
    !isLoading && (
      <SheetContent
        className='space-y-2'
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <Form {...form}>
          <form
            ref={formRef}
            className='flex w-full flex-col items-center gap-y-4'
            onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader className='w-full'>
              <SheetTitle className='pb-4 text-4xl font-bold'>
                Settings
              </SheetTitle>
              <SheetDescription className='hidden'>Settings</SheetDescription>
            </SheetHeader>

            <p className='w-full text-xl font-light text-muted-foreground'>
              Account Settings
            </p>

            <FormField
              control={form.control}
              name='avatar'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='flex items-baseline justify-between'>
                    <FormLabel>Upload Avatar Image</FormLabel>
                    <FormMessage className='text-xs font-normal' />
                  </div>
                  <FormControl>
                    <Input
                      type='file'
                      onChange={(e) =>
                        e.target.files?.length &&
                        field.onChange(e.target.files[0])
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
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
              name='theme'
              render={({ field }) => (
                <FormItem className='mr-auto flex items-center gap-x-1 py-1'>
                  <FormLabel className='!mt-0 cursor-pointer'>Theme</FormLabel>
                  <FormControl>
                    <ThemeSwitch
                      theme={field.value}
                      onThemeChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='!mt-0 cursor-pointer capitalize'>
                    {field.value}
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className='w-full text-xl font-light text-muted-foreground'>
              Notification Settings
            </p>

            <FormField
              control={form.control}
              name='remindEmail'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <div className='flex items-baseline justify-between'>
                    <FormLabel>Email for Reminders</FormLabel>
                    <FormMessage className='text-xs font-normal' />
                  </div>
                  <FormControl>
                    <Input type='email' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='remindByEmailEnabled'
              render={({ field }) => (
                <FormItem className='mr-auto flex items-center gap-x-2 py-1'>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className='!mt-0 cursor-pointer'>
                    Enable Email Reminders
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {authWithPasswordAvailable && (
              <>
                <p className='w-full text-xl font-light text-muted-foreground'>
                  Change password
                </p>
                <FormField
                  control={form.control}
                  name='oldPassword'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <div className='flex items-baseline justify-between'>
                        <FormLabel>Current Password</FormLabel>
                        <FormMessage className='text-xs font-normal' />
                      </div>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <div className='flex items-baseline justify-between'>
                        <FormLabel>New Password</FormLabel>
                        <FormMessage className='text-xs font-normal' />
                      </div>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='passwordConfirm'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <div className='flex items-baseline justify-between'>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormMessage className='text-xs font-normal' />
                      </div>
                      <FormControl>
                        <Input type='password' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}

            <SheetFooter className='mt-4 flex w-full items-center gap-4 sm:justify-between'>
              <Button disabled={!fieldsEdited} className='w-full' type='submit'>
                Update
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={handleLogout}>
                Logout
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    )
  )
}
