import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { TextSelectionWrapper } from './TextSelectionWrapper'

describe('TextSelectionWrapper', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <TextSelectionWrapper onTextSelect={vi.fn()}>
        <div>Test Content</div>
      </TextSelectionWrapper>
    )

    expect(getByText('Test Content')).toBeInTheDocument()
  })

  it('calls onTextSelect when text is selected', () => {
    const mockOnTextSelect = vi.fn()
    const { getByText } = render(
      <TextSelectionWrapper onTextSelect={mockOnTextSelect}>
        <p>Selectable text content</p>
      </TextSelectionWrapper>
    )

    // テキスト選択をシミュレート
    const text = getByText('Selectable text content')

    // window.getSelectionのモック
    const mockSelection = {
      toString: () => 'Selectable',
    }
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any)

    fireEvent.mouseUp(document)

    expect(mockOnTextSelect).toHaveBeenCalledWith('Selectable')
  })

  it('does not call onTextSelect when no text is selected', () => {
    const mockOnTextSelect = vi.fn()
    render(
      <TextSelectionWrapper onTextSelect={mockOnTextSelect}>
        <p>Content</p>
      </TextSelectionWrapper>
    )

    // 空の選択
    const mockSelection = {
      toString: () => '',
    }
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any)

    fireEvent.mouseUp(document)

    expect(mockOnTextSelect).not.toHaveBeenCalled()
  })

  it('does not call onTextSelect for very long selections', () => {
    const mockOnTextSelect = vi.fn()
    render(
      <TextSelectionWrapper onTextSelect={mockOnTextSelect}>
        <p>Content</p>
      </TextSelectionWrapper>
    )

    // 500文字を超える選択
    const longText = 'a'.repeat(501)
    const mockSelection = {
      toString: () => longText,
    }
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any)

    fireEvent.mouseUp(document)

    expect(mockOnTextSelect).not.toHaveBeenCalled()
  })
})
