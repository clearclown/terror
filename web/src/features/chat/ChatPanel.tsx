'use client'

import { useState } from 'react'
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer'
import { logger } from '@/utils/logger'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatPanel({ organizationName }: { organizationName: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `${organizationName}についてご質問ください。わかりやすく説明します。`
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      // タイムアウト付きfetch
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 35000) // 35秒でタイムアウト

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          organizationName,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // HTTPステータスコードの確認
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        // エラー時はフォールバックレスポンスを使用
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.fallbackResponse || data.error || 'エラーが発生しました。',
        }
        setMessages(prev => [...prev, assistantMessage])
      } else if (data.message) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('予期しないレスポンス形式です')
      }
    } catch (error: any) {
      logger.error('Chat API error:', error)
      
      let errorMessage = '申し訳ございません。接続エラーが発生しました。しばらく待ってから再度お試しください。'
      
      if (error.name === 'AbortError') {
        errorMessage = 'リクエストがタイムアウトしました。しばらく待ってから再度お試しください。'
      } else if (error.message) {
        errorMessage = error.message
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'ネットワークエラーが発生しました。インターネット接続を確認してください。'
      }

      const errorMsg: Message = {
        role: 'assistant',
        content: errorMessage,
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg border">
      {/* Header */}
      <div className="p-4 border-b bg-white rounded-t-lg">
        <h3 className="font-bold flex items-center gap-2">
          💬 AI アシスタント
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          わからないことを質問してください
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border'
              }`}
            >
              <MarkdownRenderer content={message.content} className="text-sm" />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border p-3 rounded-lg">
              <p className="text-sm text-gray-500">考え中...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            送信
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 ヒント: 「子供にもわかるように説明して」などと指定できます
        </p>
      </form>
    </div>
  )
}
