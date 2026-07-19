import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { ReadingSessionProvider } from './context/ReadingSessionContext'

const router = createBrowserRouter(routes)

export default function App() {
  return (
    <ReadingSessionProvider>
      <RouterProvider router={router} />
    </ReadingSessionProvider>
  )
}
