'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ModalChatWindowProps {
  isOpen: boolean
  onClose: () => void
  organizationName: string
  initialMessage?: string
}

export function ModalChatWindow({
  isOpen,
  onClose,
  organizationName,
  initialMessage,
}: ModalChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `${organizationName}について、わからないことを質問してください。`,
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 初期メッセージがある場合は自動送信
  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage, isOpen])

  // メッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = { role: 'user', content: textToSend }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          organizationName,
        }),
      })

      const data = await response.json()

      if (data.error) {
        const errorMessage: Message = {
          role: 'assistant',
          content: data.fallbackResponse || data.error,
        }
        setMessages((prev) => [...prev, errorMessage])
      } else {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: '接続エラーが発生しました。しばらく待ってから再度お試しください。',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* オーバーレイ */}
      <button
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        aria-label="チャットを閉じる"
      />

      {/* チャットウィンドウ */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transition-all duration-300
          ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}
          bottom-0 left-0 right-0 rounded-t-2xl h-[80vh]
          md:bottom-4 md:right-4 md:left-auto md:rounded-2xl md:w-[450px] md:h-[70vh]
          xl:right-[calc(calc(100%-1180px)/2)]`}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#64D8C6] to-[#BCECD3]">
          <h3 className="font-bold text-white text-lg">AI アシスタント</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-140px)]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#64D8C6] to-[#BCECD3] text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
        <div className="p-4 border-t">
          <div
            className="relative rounded-2xl p-[2px]"
            style={{
              backgroundImage:
                'linear-gradient(white, white), linear-gradient(-45deg, rgba(188, 236, 211, 1) 0%, rgba(100, 216, 198, 1) 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <div className="flex items-end gap-2 bg-white rounded-2xl p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="質問を入力..."
                className="flex-1 resize-none outline-none px-2 py-1 max-h-32 text-sm"
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-gradient-to-r from-[#64D8C6] to-[#BCECD3] text-white rounded-xl
                  hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="送信"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
