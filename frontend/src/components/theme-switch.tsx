import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { setTheme } from '@/lib/set-theme'
import { Theme } from '@/schemas/settings-schema'
import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'

export default function ThemeSwitch({
  theme,
  onThemeChange
}: {
  theme: Theme
  onThemeChange(theme: Theme): void
}) {
  const handleThemeChange = (value: Theme) => {
    setTheme(value)
    onThemeChange(value)
  }
  return (
    <ToggleGroup
      value={theme}
      onValueChange={handleThemeChange}
      type='single'
      className='h-9 rounded-md border p-1'>
      <ToggleGroupItem value='light' className='size-full'>
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value='system' className='size-full'>
        <DesktopIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value='dark' className='size-full'>
        <MoonIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
