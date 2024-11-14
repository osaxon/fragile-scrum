import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'

export default function HomePage() {
  return (
    <main className='flex flex-col items-center gap-y-4 text-center'>
      <div className='mt-4 space-y-2 text-5xl font-bold'>
        <h1>
          The <span className='text-primary'>long-term</span>
        </h1>
        <h1>habit tracker</h1>
      </div>
      <p className='text-xl font-light text-muted-foreground'>
        A simple and effective system to stay on top of recurring tasks
      </p>
      <div className='flex flex-col gap-y-1'>
        <p className='text-sm'>
          Light and fast, minimalistic modern UI, no bloat, no useless features
        </p>
        <p className='font-me text-sm'>
          Completely free, no ads, no spam, no e-begging
        </p>
        <p className='font-me text-sm'>Open source and self-hostable</p>
        <p className='font-me text-sm'>Customizable notifications</p>
        <p className='font-me text-sm'>Access from anywhere</p>
      </div>
      <div className='flex gap-x-2'>
        <Button asChild className='mt-2 w-32'>
          <Link to='/login'>Get Started</Link>
        </Button>
        <Button asChild variant='link' className='mt-2 w-32 hover:no-underline'>
          <a target='_blank' href='https://github.com/s-petr/longhabit'>
            <GitHubLogoIcon /> Source Code
          </a>
        </Button>
      </div>
    </main>
  )
}
