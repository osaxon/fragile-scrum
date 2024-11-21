import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

export default function SwitchField<T extends FieldValues>({
  form,
  name,
  label,
  disabled = false
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  type?: React.HTMLInputTypeAttribute
  disabled?: boolean
}) {
  label ??=
    name.length < 2 ? name : name[0].toUpperCase() + name.slice(1).toLowerCase()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex w-full items-center gap-x-2 py-1'>
          <FormControl>
            <Switch
              checked={!!field.value}
              disabled={disabled}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className='!mt-0 cursor-pointer'>{label}</FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
