import { Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import Footer from './components/footer/footer'
import Navigation from './components/header/navigation'

export default function RootLayout() {
  return (
    <div className='mx-auto flex min-h-dvh max-w-[800px] flex-col gap-4 px-4 py-2'>
      <Navigation />
      <Outlet />
      <Footer />
      <Toaster position='bottom-center' toastOptions={{ duration: 2500 }} />
    </div>
  )
}
