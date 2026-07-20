import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { routes } from './routes'

function renderAtPath(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
}

describe('routes', () => {
  it('renders the home page at /', () => {
    renderAtPath('/')
    expect(screen.getByRole('heading', { name: '夜语塔罗' })).toBeInTheDocument()
  })

  it('renders the draw page at /draw', () => {
    renderAtPath('/draw')
    expect(screen.getByText('静下心来，默念你的问题')).toBeInTheDocument()
  })

  it('renders the encyclopedia page at /encyclopedia', () => {
    renderAtPath('/encyclopedia')
    expect(screen.getByText(/牌意图鉴页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the about page at /about', () => {
    renderAtPath('/about')
    expect(screen.getByText(/关于页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the login page at /login', () => {
    renderAtPath('/login')
    expect(screen.getByText(/登录页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the register page at /register', () => {
    renderAtPath('/register')
    expect(screen.getByText(/注册页面正在筹备中/)).toBeInTheDocument()
  })

  it('renders the profile page at /profile', () => {
    renderAtPath('/profile')
    expect(screen.getByText(/占卜师主页正在筹备中/)).toBeInTheDocument()
  })

  it('wraps every route in RootLayout (nav is present)', () => {
    renderAtPath('/about')
    expect(screen.getByText('MIDNIGHT ORACLE')).toBeInTheDocument()
  })
})
