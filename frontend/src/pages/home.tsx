import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export default function HomePage() {
  return (
    <div>
      <h2 className='pb-4 text-2xl'>The long-term habit tracker</h2>
      <Button asChild className='w-24'>
        <Link to='/login'>Login</Link>
      </Button>
    </div>
  )
}
