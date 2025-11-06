import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FixedChatButton } from './FixedChatButton'

describe('FixedChatButton', () => {
  it('renders with correct text', () => {
    const mockOnOpenChat = vi.fn()
    render(
      <FixedChatButton
        organizationName="Test Organization"
        onOpenChat={mockOnOpenChat}
      />
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls onOpenChat when clicked', () => {
    const mockOnOpenChat = vi.fn()
    render(
      <FixedChatButton
        organizationName="Test Organization"
        onOpenChat={mockOnOpenChat}
      />
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockOnOpenChat).toHaveBeenCalledTimes(1)
    expect(mockOnOpenChat).toHaveBeenCalledWith()
  })

  it('has gradient border styling', () => {
    const mockOnOpenChat = vi.fn()
    const { container } = render(
      <FixedChatButton
        organizationName="Test Organization"
        onOpenChat={mockOnOpenChat}
      />
    )

    const gradientDiv = container.querySelector('[style*="gradient"]')
    expect(gradientDiv).toBeInTheDocument()
  })

  it('is hidden on desktop (has pc:hidden class)', () => {
    const mockOnOpenChat = vi.fn()
    const { container } = render(
      <FixedChatButton
        organizationName="Test Organization"
        onOpenChat=  {mockOnOpenChat}
      />
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('pc:hidden')
  })
})
