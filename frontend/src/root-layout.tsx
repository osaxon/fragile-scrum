import { Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import Navigation from './components/navigation'

export default function RootLayout() {
  return (
    <div className='mx-auto flex max-w-[800px] flex-col gap-4 px-4 py-2'>
      <Navigation />
      <Outlet />
      <Toaster position='bottom-center' />
    </div>
  )
}
