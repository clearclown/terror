'use client'

import { useEffect, ReactNode } from 'react'

interface TextSelectionWrapperProps {
  children: ReactNode
  onTextSelect: (text: string) => void
}

export function TextSelectionWrapper({ children, onTextSelect }: TextSelectionWrapperProps) {
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim()

      if (selectedText && selectedText.length > 0 && selectedText.length < 500) {
        // 選択されたテキストが妥当な長さの場合のみ処理
        onTextSelect(selectedText)
      }
    }

    // マウスアップ時に選択を検出
    document.addEventListener('mouseup', handleSelection)
    // タッチデバイス対応
    document.addEventListener('touchend', handleSelection)

    return () => {
      document.removeEventListener('mouseup', handleSelection)
      document.removeEventListener('touchend', handleSelection)
    }
  }, [onTextSelect])

  return <>{children}</>
}
