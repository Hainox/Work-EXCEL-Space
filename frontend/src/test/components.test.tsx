import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TableView } from '../components/TableView'
import type { Column, Row } from '../types/spreadsheet'

vi.mock('../context/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isAuthenticated: false,
    register: vi.fn(),
    logout: vi.fn(),
  }),
}))

const columns: Column[] = [
  { key: '1', label: 'Name' },
  { key: '2', label: 'Score' },
]

const rows: Row[] = [
  { '1': 'Alice', '2': 95 },
  { '1': 'Bob', '2': 72 },
  { '1': 'Charlie', '2': 88 },
]

describe('TableView', () => {
  it('renders all rows', () => {
    render(
      <MemoryRouter>
        <TableView columns={columns} rows={rows} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
  })

  it('filters rows by search input (OR across columns)', () => {
    render(
      <MemoryRouter>
        <TableView columns={columns} rows={rows} />
      </MemoryRouter>,
    )
    const search = screen.getByPlaceholderText(/поиск/i)
    fireEvent.change(search, { target: { value: 'ali' } })
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  it('shows empty state when no rows match', () => {
    render(
      <MemoryRouter>
        <TableView columns={columns} rows={rows} />
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByPlaceholderText(/поиск/i), {
      target: { value: 'zzz_no_match' },
    })
    expect(screen.getByText('Нет данных')).toBeInTheDocument()
  })

  it('sorts by clicking column header', () => {
    render(
      <MemoryRouter>
        <TableView columns={columns} rows={rows} />
      </MemoryRouter>,
    )
    // Click Score header once → ascending
    fireEvent.click(screen.getByText(/Score/))
    const cells = screen.getAllByRole('cell')
    // First data cell should be Bob (72) in ascending Score order
    expect(cells[0].textContent).toBe('Bob')
  })
  it('edits the original row index after sorting', async () => {
    const onCellEdit = vi.fn().mockResolvedValue(undefined)
    render(
      <MemoryRouter>
        <TableView columns={columns} rows={rows} onCellEdit={onCellEdit} />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText(/Score/))
    fireEvent.doubleClick(screen.getByText('Bob'))

    const input = screen.getByDisplayValue('Bob')
    fireEvent.change(input, { target: { value: 'Bobby' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    await waitFor(() => {
      expect(onCellEdit).toHaveBeenCalledWith(1, '1', 'Bobby')
    })
  })

})

describe('UploadZone', () => {
  it('renders upload hint text', async () => {
    const { UploadZone } = await import('../components/UploadZone')
    render(<UploadZone onFile={vi.fn()} />)
    expect(screen.getByText(/перетащите/i)).toBeInTheDocument()
  })

  it('shows uploading state', async () => {
    const { UploadZone } = await import('../components/UploadZone')
    render(<UploadZone onFile={vi.fn()} uploading />)
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument()
  })
})

describe('LoginPage', () => {
  it('renders login form', async () => {
    const { LoginPage } = await import('../pages/LoginPage')
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /вход/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument()
  })
})
