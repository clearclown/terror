'use client'

import { useState } from 'react'

type DifficultyMode = 'simple' | 'detailed'

interface DifficultyToggleProps {
  simpleText: string
  detailedText: string
}

export function DifficultyToggle({ simpleText, detailedText }: DifficultyToggleProps) {
  const [mode, setMode] = useState<DifficultyMode>('simple')

  return (
    <div className="space-y-4">
      {/* Toggle Buttons */}
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

      {/* Content */}
      <div className="p-6 bg-white border rounded-lg">
        {mode === 'simple' ? (
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{simpleText}</p>
          </div>
        ) : (
          <div className="prose max-w-none">
            <p className="leading-relaxed">{detailedText}</p>
          </div>
        )}
      </div>

      {/* Hint */}
      <div className="text-sm text-gray-500">
        {mode === 'simple' ? (
          <p>💡 よりわかりやすい表現で説明しています</p>
        ) : (
          <p>📖 専門的な情報も含めて詳しく説明しています</p>
        )}
      </div>
    </div>
  )
}
