import { Avatar, AvatarImage } from '@/components/ui/avatar'
import useAuth from '@/hooks/use-auth'
import { Link } from '@tanstack/react-router'
import SettingsForm from '../settings/settings-form'
import { DefaultUserAvatarLogo, LongHabitMainLogo } from '../shared/logos'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

export default function Navigation() {
  const { user } = useAuth()
  const { avatar, id: userId } = user ?? {}

  return (
    <nav className='flex items-center justify-between'>
      <Link to='/' className='focus:outline-hidden'>
        <LongHabitMainLogo />
      </Link>

      <Sheet>
        {user ? (
          <SheetTrigger>
            <Avatar className='flex size-10 items-center justify-center'>
              {avatar ? (
                <AvatarImage
                  src={`/api/files/users/${userId}/${avatar}?thumb=100x100`}
                  alt='user avatar icon'
                />
              ) : (
                <DefaultUserAvatarLogo />
              )}
            </Avatar>
          </SheetTrigger>
        ) : null}

        <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <SettingsForm />
        </SheetContent>
      </Sheet>
    </nav>
  )
}
