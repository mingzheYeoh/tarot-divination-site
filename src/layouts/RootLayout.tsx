import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import AtmosphereLayer from '../components/AtmosphereLayer'

export default function RootLayout() {
  return (
    <div className="relative min-h-screen bg-background text-on-surface font-body-md">
      <AtmosphereLayer />
      <Nav />
      <div className="relative z-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
