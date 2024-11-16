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
import useAuth from '@/hooks/use-auth'
import useSettings from '@/hooks/use-settings'
import {
  UpdateUserSettingsFields,
  updateUserSettingsSchema
} from '@/schemas/user-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'

export default function SettingsPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const { logout } = useAuth()

  const {
    userId,
    name,
    remindEmail,
    remindByEmailEnabled,
    theme,
    authWithPasswordAvailable,
    isLoading,
    updateSettings
  } = useSettings()

  const form = useForm<UpdateUserSettingsFields>({
    resolver: zodResolver(updateUserSettingsSchema),
    defaultValues: {
      name,
      theme,
      remindEmail,
      remindByEmailEnabled,
      oldPassword: '',
      password: '',
      passwordConfirm: ''
    }
  })

  const fieldsEdited = form.formState.isDirty

  return (
    !isLoading && (
      <SheetContent
        className='space-y-2'
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <Form {...form}>
          <form
            ref={formRef}
            className='flex w-full flex-col items-center gap-y-4'
            onSubmit={form.handleSubmit(
              (userData) => userId && updateSettings(userId, userData)
            )}>
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
                    <FormLabel>Upload avatar image</FormLabel>
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
                <FormItem className='mr-auto'>
                  <FormLabel className='!mt-0 cursor-pointer'>Theme</FormLabel>
                  <div className='flex items-center gap-x-1'>
                    <FormControl>
                      <ThemeSwitch
                        theme={field.value}
                        onThemeChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='!mt-0 cursor-pointer capitalize'>
                      {field.value}
                    </FormLabel>
                  </div>
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
                    <FormLabel>Email for reminders</FormLabel>
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
                    Enable email reminders
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {authWithPasswordAvailable && (
              <>
                <p className='w-full text-xl font-light text-muted-foreground'>
                  Change Password
                </p>
                <FormField
                  control={form.control}
                  name='oldPassword'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <div className='flex items-baseline justify-between'>
                        <FormLabel>Current password</FormLabel>
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
                        <FormLabel>New password</FormLabel>
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
                        <FormLabel>Confirm new password</FormLabel>
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
              <Button variant='outline' className='w-full' onClick={logout}>
                Logout
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    )
  )
}
