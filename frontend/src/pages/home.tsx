import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { BrainCircuitIcon, CircleHelpIcon, ListTodoIcon } from 'lucide-react'

export default function HomePage() {
  return (
    <main className='mx-auto flex max-w-3xl flex-col items-center gap-y-12 px-4'>
      <section className='w-full space-y-3 text-center'>
        <h1 className='my-6 text-5xl font-bold'>
          Long<span className='text-primary'> Habit</span>
        </h1>
        <h2 className='text-2xl font-semibold'>
          The perfect tracker for tasks that don&apos;t get daily attention
        </h2>
        <p className='text-xl font-light text-muted-foreground'>
          Daily habits are easy to remember, but what about those important
          tasks that come up every few weeks or months? Long Habit helps you
          stay on top of these easily forgotten but crucial routines.
        </p>
      </section>

      <section className='flex w-full flex-col justify-center gap-4 sm:flex-row'>
        <Button asChild size='lg' className='w-full sm:w-40'>
          <Link to='/register'>Get Started</Link>
        </Button>
        <Button asChild variant='outline' size='lg' className='w-full sm:w-40'>
          <Link to='/login'>Log in</Link>
        </Button>
      </section>

      <section className='w-full space-y-2 rounded-lg bg-popover p-4'>
        <h2 className='flex items-center gap-x-2 text-2xl font-semibold'>
          <ListTodoIcon className='size-6 text-primary/80' /> How it Works
        </h2>
        <ol className='list-decimal space-y-2 pl-4 text-sm text-muted-foreground'>
          <li>Add tasks you want to track to the list</li>
          <li>Set a goal. How often do you want to repeat the task?</li>
          <li>Mark tasks as completed on the days you do them</li>
          <li>
            Get reminders when you miss your goal and tasks become overdue
          </li>
        </ol>
      </section>

      <section className='w-full space-y-4 rounded-lg bg-popover p-4'>
        <h2 className='flex items-center gap-x-2 text-2xl font-semibold'>
          <BrainCircuitIcon className='size-6 text-primary/80' /> Smart Features
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Simple Tracking</h4>
            <p className='text-sm text-muted-foreground'>
              See when you last completed each task and how many days have
              passed since
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Flexible Goals</h4>
            <p className='text-sm text-muted-foreground'>
              Set up intervals for each recurring task
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Smart Reminders</h4>
            <p className='text-sm text-muted-foreground'>
              Receive customizable notifications by email
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Easy Navigation</h4>
            <p className='text-sm text-muted-foreground'>
              Sort, search, filter and group tasks by category
            </p>
          </div>
        </div>
      </section>

      <section className='mb-16 w-full space-y-4 rounded-lg bg-popover p-4'>
        <h2 className='flex items-center gap-x-2 text-2xl font-semibold'>
          <CircleHelpIcon className='size-6 text-primary/80' /> Why Use Long
          Habit?
        </h2>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Minimalist Design</h4>
            <p className='text-sm text-muted-foreground'>
              Light, fast and focused on the essential
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Completely Free</h4>
            <p className='text-sm text-muted-foreground'>
              No ads, no spam, no e-begging
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Privacy First</h4>
            <p className='text-sm text-muted-foreground'>
              Open source and self-hostable
            </p>
          </div>
          <div className='space-y-1'>
            <h4 className='font-semibold'>Access Anywhere</h4>
            <p className='text-sm text-muted-foreground'>
              Web-based, use from any device, anytime
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
