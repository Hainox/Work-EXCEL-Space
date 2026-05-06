import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { WelcomePage } from '../pages/WelcomePage'

describe('WelcomePage', () => {
  it('renders the app title', () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Work EXCEL Space')).toBeInTheDocument()
  })

  it('renders the login and sign-up buttons', () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /создать аккаунт/i })).toBeInTheDocument()
  })
})
