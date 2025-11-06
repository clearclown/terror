import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ModalChatWindow } from './ModalChatWindow'

// Fetch APIのモック
global.fetch = vi.fn()

describe('ModalChatWindow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when isOpen is true', () => {
    render(
      <ModalChatWindow
        isOpen={true}
        onClose={vi.fn()}
        organizationName="Test Org"
      />
    )

    expect(screen.getByText('AI アシスタント')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ModalChatWindow
        isOpen={false}
        onClose={vi.fn()}
        organizationName="Test Org"
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('calls onClose when overlay is clicked', () => {
    const mockOnClose = vi.fn()
    render(
      <ModalChatWindow
        isOpen={true}
        onClose={mockOnClose}
        organizationName="Test Org"
      />
    )

    const overlay = screen.getByLabelText('チャットを閉じる')
    fireEvent.click(overlay)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn()
    render(
      <ModalChatWindow
        isOpen={true}
        onClose={mockOnClose}
        organizationName="Test Org"
      />
    )

    const closeButton = screen.getByLabelText('閉じる')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('displays initial welcome message', () => {
    render(
      <ModalChatWindow
        isOpen={true}
        onClose={vi.fn()}
        organizationName="Test Organization"
      />
    )

    expect(
      screen.getByText(/Test Organizationについて、わからないことを質問してください/)
    ).toBeInTheDocument()
  })

  it('can send a message', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ message: 'AI response' }),
    })

    render(
      <ModalChatWindow
        isOpen={true}
        onClose={vi.fn()}
        organizationName="Test Org"
      />
    )

    const textarea = screen.getByPlaceholderText('質問を入力...')
    const sendButton = screen.getByLabelText('送信')

    fireEvent.change(textarea, { target: { value: 'Test question' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(screen.getByText('Test question')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('AI response')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    render(
      <ModalChatWindow
        isOpen={true}
        onClose={vi.fn()}
        organizationName="Test Org"
      />
    )

    const textarea = screen.getByPlaceholderText('質問を入力...')
    const sendButton = screen.getByLabelText('送信')

    fireEvent.change(textarea, { target: { value: 'Test question' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(
        screen.getByText(/接続エラーが発生しました/)
      ).toBeInTheDocument()
    })
  })
})
