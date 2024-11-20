import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export default function PasswordField<T extends FieldValues>({
  form,
  name,
  label
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  label ??=
    name.length < 2 ? name : name[0].toUpperCase() + name.slice(1).toLowerCase()

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='w-full'>
          <div className='flex items-baseline justify-between'>
            <FormLabel>{label}</FormLabel>
            <FormMessage className='text-xs font-normal' />
          </div>
          <div className='relative'>
            <FormControl>
              <Input
                className='pr-8'
                type={isVisible ? 'text' : 'password'}
                {...field}
              />
            </FormControl>
            {!!field.value.length && (
              <div
                className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'
                onClick={() => setIsVisible((current) => !current)}>
                {isVisible ? (
                  <EyeNoneIcon className='size-4 text-muted-foreground' />
                ) : (
                  <EyeOpenIcon className='size-4 text-muted-foreground' />
                )}
              </div>
            )}
          </div>
        </FormItem>
      )}
    />
  )
}
