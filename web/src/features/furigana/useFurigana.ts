'use client'

import { useState, useEffect } from 'react'
import { logger } from '@/utils/logger'

interface UseFuriganaOptions {
  enabled?: boolean
  autoInit?: boolean
}

interface UseFuriganaReturn {
  convert: (text: string) => Promise<string>
  isReady: boolean
  error: string | null
}

let kuroshiroInstance: any = null
let initPromise: Promise<any> | null = null

/**
 * Furigana conversion hook using Kuroshiro
 *
 * Usage:
 * ```tsx
 * const { convert, isReady } = useFurigana()
 * const [result, setResult] = useState('')
 *
 * useEffect(() => {
 *   if (isReady) {
 *     convert('漢字テキスト').then(setResult)
 *   }
 * }, [isReady])
 * ```
 */
export function useFurigana(options: UseFuriganaOptions = {}): UseFuriganaReturn {
  const { enabled = true, autoInit = true } = options
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !autoInit || typeof window === 'undefined') {
      return
    }

    const initKuroshiro = async () => {
      if (kuroshiroInstance) {
        setIsReady(true)
        return
      }

      if (initPromise) {
        await initPromise
        setIsReady(true)
        return
      }

      try {
        initPromise = (async () => {
          const Kuroshiro = (await import('kuroshiro')).default
          const KuromojiAnalyzer = (await import('kuroshiro-analyzer-kuromoji')).default

          const kuroshiro = new Kuroshiro()
          await kuroshiro.init(new KuromojiAnalyzer())

          kuroshiroInstance = kuroshiro
          return kuroshiro
        })()

        await initPromise
        setIsReady(true)
      } catch (err) {
        logger.error('Failed to initialize Kuroshiro:', err)
        setError('ふりがなライブラリの初期化に失敗しました')
        initPromise = null
      }
    }

    initKuroshiro()
  }, [enabled, autoInit])

  const convert = async (text: string): Promise<string> => {
    if (!enabled || !kuroshiroInstance) {
      return text
    }

    try {
      const result = await kuroshiroInstance.convert(text, {
        to: 'hiragana',
        mode: 'furigana',
      })
      return result
    } catch (err) {
      logger.error('Furigana conversion error:', err)
      return text
    }
  }

  return {
    convert,
    isReady,
    error,
  }
}

/**
 * Convert text to furigana format (ruby HTML)
 * For server-side or one-time conversions
 */
export async function convertToFurigana(text: string): Promise<string> {
  if (typeof window === 'undefined') {
    return text // Return as-is on server
  }

  try {
    if (!kuroshiroInstance) {
      const Kuroshiro = (await import('kuroshiro')).default
      const KuromojiAnalyzer = (await import('kuroshiro-analyzer-kuromoji')).default

      kuroshiroInstance = new Kuroshiro()
      await kuroshiroInstance.init(new KuromojiAnalyzer())
    }

    const result = await kuroshiroInstance.convert(text, {
      to: 'hiragana',
      mode: 'furigana',
    })
    return result
  } catch (err) {
    logger.error('Furigana conversion error:', err)
    return text
  }
}
