import { Button } from '@/components/ui/button'
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
        Simple and effective system to stay on top of recurring tasks
      </p>
      <Button asChild className='w-32 mt-4'>
        <Link to='/login'>Get Started</Link>
      </Button>
    </main>
  )
}
