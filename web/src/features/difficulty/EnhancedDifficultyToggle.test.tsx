import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EnhancedDifficultyToggle } from './EnhancedDifficultyToggle'

describe('EnhancedDifficultyToggle', () => {
  const simpleText = 'This is simple text'
  const detailedText = 'This is detailed text with more information'

  it('renders both toggle buttons', () => {
    render(
      <EnhancedDifficultyToggle
        simpleText={simpleText}
        detailedText={detailedText}
      />
    )

    expect(screen.getByText('😊 やさしく')).toBeInTheDocument()
    expect(screen.getByText('📚 詳しく')).toBeInTheDocument()
  })

  it('shows simple text by default', () => {
    render(
      <EnhancedDifficultyToggle
        simpleText={simpleText}
        detailedText={detailedText}
      />
    )

    expect(screen.getByText(simpleText)).toBeInTheDocument()
  })

  it('switches to detailed text when detailed button is clicked', () => {
    render(
      <EnhancedDifficultyToggle
        simpleText={simpleText}
        detailedText={detailedText}
      />
    )

    const detailedButton = screen.getByText('📚 詳しく')
    fireEvent.click(detailedButton)

    expect(screen.getByText(detailedText)).toBeInTheDocument()
  })

  it('switches back to simple text when simple button is clicked', () => {
    render(
      <EnhancedDifficultyToggle
        simpleText={simpleText}
        detailedText={detailedText}
      />
    )

    const detailedButton = screen.getByText('📚 詳しく')
    const simpleButton = screen.getByText('😊 やさしく')

    fireEvent.click(detailedButton)
    fireEvent.click(simpleButton)

    expect(screen.getByText(simpleText)).toBeInTheDocument()
  })

  it('renders furigana toggle button', () => {
    render(
      <EnhancedDifficultyToggle
        simpleText={simpleText}
        detailedText={detailedText}
      />
    )

    expect(screen.getByText(/ふりがな/)).toBeInTheDocument()
  })

  it('has correct active states for buttons', () => {
    render(
      <EnhancedDifficultyToggle
        simpleText={simpleText}
        detailedText={detailedText}
      />
    )

    const simpleButton = screen.getByText('😊 やさしく')
    const detailedButton = screen.getByText('📚 詳しく')

    // Simple is active by default
    expect(simpleButton).toHaveClass('bg-blue-600')
    expect(detailedButton).toHaveClass('bg-gray-100')

    // Click detailed
    fireEvent.click(detailedButton)

    expect(simpleButton).toHaveClass('bg-gray-100')
    expect(detailedButton).toHaveClass('bg-blue-600')
  })
})
