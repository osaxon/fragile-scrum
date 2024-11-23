import { Avatar, AvatarImage } from '@/components/ui/avatar'
import useAuth from '@/hooks/use-auth'
import { Link } from '@tanstack/react-router'

function MainLogo() {
  return (
    <figure className='flex select-none items-center gap-x-1'>
      <div className='my-4 h-6'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          version='1.1'
          width='100%'
          height='100%'
          viewBox='11.254003524780273 32.167354583740234 77.49298858642578 35.664310455322266'>
          <g fill='url(#SvgjsLinearGradient1000)'>
            <path d='M88.727 49.043a17.404 17.404 0 0 0-11.281-15.598 17.902 17.902 0 0 0-10.285-.902 17.885 17.885 0 0 0-9.067 4.937l-5.879 5.88 4.426 4.425 5.88-5.879v.004a11.724 11.724 0 0 1 12.663-2.629 11.09 11.09 0 0 1 7.29 10.047 15.1 15.1 0 0 1-.001 1.348 11.089 11.089 0 0 1-7.289 10.043 11.723 11.723 0 0 1-12.664-2.625L41.907 37.48a17.885 17.885 0 0 0-9.066-4.938 17.902 17.902 0 0 0-10.285.903 17.399 17.399 0 0 0-7.993 6.097 17.395 17.395 0 0 0-3.289 9.5c-.015.317-.02.637-.02.957s.009.641.02.958a17.404 17.404 0 0 0 11.282 15.597 18.469 18.469 0 0 0 6.687 1.27 17.836 17.836 0 0 0 12.664-5.305l5.88-5.879-4.427-4.426-5.879 5.88a11.73 11.73 0 0 1-12.664 2.624 11.089 11.089 0 0 1-7.289-10.043 13.669 13.669 0 0 1-.015-.672c0-.226.004-.449.015-.675v-.004a11.089 11.089 0 0 1 7.29-10.043 12.346 12.346 0 0 1 4.425-.82 11.455 11.455 0 0 1 8.238 3.445L58.094 62.52a17.885 17.885 0 0 0 9.067 4.937 17.91 17.91 0 0 0 10.285-.902 17.415 17.415 0 0 0 11.281-15.598c.016-.316.02-.637.02-.957s-.008-.64-.02-.957z' />
          </g>
          <defs>
            <linearGradient
              gradientUnits='userSpaceOnUse'
              id='SvgjsLinearGradient1000'
              x1='21.71117305755615'
              y1='78.2888345718384'
              x2='78.28982257843018'
              y2='21.71018505096436'>
              <stop stopColor='#bf4ff8' offset='0.05' />
              <stop stopColor='#7c08c0' offset='0.95' />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <figcaption className='text-lg font-extrabold uppercase italic tracking-wider'>
        Long Habit
      </figcaption>
    </figure>
  )
}

function DefaultAvatarLogo() {
  return (
    <figure>
      <svg
        width='24'
        height='24'
        viewBox='0 0 15 15'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z'
          fill='currentColor'></path>
      </svg>
      <figcaption className='hidden'>User avatar logo</figcaption>
    </figure>
  )
}

export default function Navigation() {
  const { user } = useAuth()
  const { avatar, id: userId, verified } = user ?? {}

  return (
    <nav className='flex items-center justify-between'>
      <Link to='/' disabled={verified}>
        <MainLogo />
      </Link>
      {userId && verified && (
        <Link to='/tasks/settings'>
          <Avatar className='flex items-center justify-center ring-offset-background transition duration-300 ease-in-out hover:ring-ring hover:ring-offset-0'>
            {avatar ? (
              <AvatarImage
                src={`/api/files/users/${userId}/${avatar}?thumb=100x100`}
                alt='user icon'
              />
            ) : (
              <DefaultAvatarLogo />
            )}
          </Avatar>
        </Link>
      )}
    </nav>
  )
}
