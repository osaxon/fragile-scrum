import { Avatar, AvatarImage } from '@/components/ui/avatar'
import useAuth from '@/hooks/use-auth'
import { Link } from '@tanstack/react-router'
import { DefaultUserAvatarLogo, LongHabitMainLogo } from '../shared/logos'

export default function Navigation() {
  const { user } = useAuth()
  const { avatar, id: userId, verified } = user ?? {}

  return (
    <nav className='flex items-center justify-between'>
      <Link to='/' disabled={verified}>
        <LongHabitMainLogo />
      </Link>
      <Link to={verified ? '/tasks/settings' : '/login'}>
        <Avatar className='flex items-center justify-center ring-offset-background transition duration-300 ease-in-out hover:ring-ring hover:ring-offset-0'>
          {avatar ? (
            <AvatarImage
              src={`/api/files/users/${userId}/${avatar}?thumb=100x100`}
              alt='user icon'
            />
          ) : (
            <DefaultUserAvatarLogo />
          )}
        </Avatar>
      </Link>
    </nav>
  )
}
