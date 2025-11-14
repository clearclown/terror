'use client'

import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { logger } from '@/utils/logger'

// Kuroshiroはブラウザでのみ動作するため、動的インポートを使用
let Kuroshiro: any
let KuromojiAnalyzer: any

if (typeof window !== 'undefined') {
  import('kuroshiro').then((module) => {
    Kuroshiro = module.default
  })
  import('kuroshiro-analyzer-kuromoji').then((module) => {
    KuromojiAnalyzer = module.default
  })
}

interface FuriganaTextProps {
  text: string
  enabled?: boolean
  className?: string
}

export function FuriganaText({ text, enabled = true, className = '' }: FuriganaTextProps) {
  const [convertedText, setConvertedText] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initKuroshiro = async () => {
      if (!enabled || typeof window === 'undefined') {
        setConvertedText(text)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Kuroshiroの初期化を待つ
        while (!Kuroshiro || !KuromojiAnalyzer) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        const kuroshiro = new Kuroshiro()
        await kuroshiro.init(new KuromojiAnalyzer())

        const result = await kuroshiro.convert(text, {
          to: 'hiragana',
          mode: 'furigana',
        })

        if (mounted) {
          setConvertedText(result)
          setIsLoading(false)
        }
      } catch (err) {
        logger.error('Furigana conversion error:', err)
        if (mounted) {
          setError('ふりがな変換に失敗しました')
          setConvertedText(text)
          setIsLoading(false)
        }
      }
    }

    initKuroshiro()

    return () => {
      mounted = false
    }
  }, [text, enabled])

  if (!enabled) {
    return <span className={className}>{text}</span>
  }

  if (isLoading) {
    return <span className={`${className} text-gray-400`}>読み込み中...</span>
  }

  if (error) {
    return <span className={className}>{text}</span>
  }

  // DOMPurifyでHTMLをサニタイズしてXSS攻撃を防ぐ
  const sanitizedHTML = typeof window !== 'undefined'
    ? DOMPurify.sanitize(convertedText, {
        ALLOWED_TAGS: ['ruby', 'rb', 'rt', 'rp', 'span'],
        ALLOWED_ATTR: ['class']
      })
    : text

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}

// シンプルなトグル付きコンポーネント
export function FuriganaToggleText({ text, className = '' }: Omit<FuriganaTextProps, 'enabled'>) {
  const [furiganaEnabled, setFuriganaEnabled] = useState(false)

  return (
    <div className="space-y-2">
      <button
        onClick={() => setFuriganaEnabled(!furiganaEnabled)}
        className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full font-medium transition"
      >
        {furiganaEnabled ? '✓ ふりがな表示中' : 'ふりがなを表示'}
      </button>
      <FuriganaText text={text} enabled={furiganaEnabled} className={className} />
    </div>
  )
}
