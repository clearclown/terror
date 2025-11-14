'use client'

import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { useFurigana } from '@/features/furigana/useFurigana'

type DifficultyMode = 'simple' | 'detailed'

interface EnhancedDifficultyToggleProps {
  simpleText: string
  detailedText: string
}

export function EnhancedDifficultyToggle({ simpleText, detailedText }: EnhancedDifficultyToggleProps) {
  const [mode, setMode] = useState<DifficultyMode>('simple')
  const [furiganaEnabled, setFuriganaEnabled] = useState(false)
  const [displayText, setDisplayText] = useState<string>('')

  const { convert, isReady } = useFurigana()

  const currentText = mode === 'simple' ? simpleText : detailedText

  useEffect(() => {
    const updateText = async () => {
      if (furiganaEnabled && isReady) {
        const converted = await convert(currentText)
        setDisplayText(converted)
      } else {
        setDisplayText(currentText)
      }
    }

    updateText()
  }, [currentText, furiganaEnabled, isReady, convert])

  return (
    <div className="space-y-4">
      {/* Toggle Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Difficulty Mode Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('simple')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              mode === 'simple'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            😊 やさしく
          </button>
          <button
            onClick={() => setMode('detailed')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              mode === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📚 詳しく
          </button>
        </div>

        {/* Furigana Toggle */}
        <button
          onClick={() => setFuriganaEnabled(!furiganaEnabled)}
          disabled={!isReady}
          className={`px-4 py-2 rounded-lg font-bold transition ${
            furiganaEnabled
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={!isReady ? 'ふりがな機能を読み込み中...' : undefined}
        >
          {furiganaEnabled ? '✓ ふりがな' : 'あ ふりがな'}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 bg-white border rounded-lg">
        <div className="prose max-w-none">
          {furiganaEnabled ? (
            <div
              className={mode === 'simple' ? 'text-lg leading-relaxed' : 'leading-relaxed'}
              dangerouslySetInnerHTML={{
                __html: typeof window !== 'undefined'
                  ? DOMPurify.sanitize(displayText, {
                      ALLOWED_TAGS: ['ruby', 'rb', 'rt', 'rp', 'span'],
                      ALLOWED_ATTR: ['class']
                    })
                  : displayText
              }}
            />
          ) : (
            <p className={mode === 'simple' ? 'text-lg leading-relaxed' : 'leading-relaxed'}>
              {displayText}
            </p>
          )}
        </div>
      </div>

      {/* Hint */}
      <div className="text-sm text-gray-500 space-y-1">
        {mode === 'simple' ? (
          <p>💡 よりわかりやすい表現で説明しています</p>
        ) : (
          <p>📖 専門的な情報も含めて詳しく説明しています</p>
        )}
        {furiganaEnabled && (
          <p>あ 難しい漢字にふりがなを表示しています</p>
        )}
      </div>
    </div>
  )
}
