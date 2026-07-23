import Logo from '@/components/header/Logo'
import Navbar from '@/components/header/Navbar'
import LocationClock from '@/components/header/LocationClock'

export default function Header() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50 bg-transparent">
      <div className="site-container pointer-events-auto grid grid-cols-[1fr_auto_1fr] items-center py-6">
        <div className="justify-self-start">
          <Logo />
        </div>

        <div className="justify-self-center">
          <Navbar />
        </div>

        <div className="justify-self-end">
          <LocationClock />
        </div>
      </div>
    </header>
  )
}
