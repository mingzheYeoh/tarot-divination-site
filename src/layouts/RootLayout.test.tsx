import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import RootLayout from './RootLayout'

describe('RootLayout', () => {
  it('renders Nav, Footer, and the routed child content', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <RootLayout />,
          children: [{ index: true, element: <div>Page Content</div> }],
        },
      ],
      { initialEntries: ['/'] },
    )
    render(<RouterProvider router={router} />)
    expect(screen.getByText('MIDNIGHT ORACLE')).toBeInTheDocument()
    expect(screen.getByText('Midnight Oracle')).toBeInTheDocument()
    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })
})
