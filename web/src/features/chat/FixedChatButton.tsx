'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { MessageCircle } from 'lucide-react'

interface FixedChatButtonProps {
  organizationName: string
  onOpenChat: (initialMessage?: string) => void
}

export interface FixedChatButtonRef {
  openWithText: (text: string) => void
}

export const FixedChatButton = forwardRef<FixedChatButtonRef, FixedChatButtonProps>(
  ({ organizationName, onOpenChat }, ref) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useImperativeHandle(ref, () => ({
      openWithText: (text: string) => {
        const formattedMessage = `『${text}』について教えてください。`
        onOpenChat(formattedMessage)
      },
    }))

    useEffect(() => {
      let ticking = false

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY

            // 下スクロール: 縮小
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              setIsExpanded(false)
            }
            // 上スクロール: 展開
            else if (currentScrollY < lastScrollY) {
              setIsExpanded(true)
            }

            setLastScrollY(currentScrollY)
            ticking = false
          })
          ticking = true
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    return (
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ease-out
          ${isVisible ? 'bottom-4 md:bottom-8 opacity-100' : 'bottom-0 opacity-0'}
          ${isExpanded ? 'w-[calc(100%-48px)] max-w-[460px]' : 'w-[120px]'}
          pc:hidden`}
      >
        {/* グラデーションボーダー */}
        <div
          className="relative rounded-[50px] p-[2px] shadow-lg"
          style={{
            background: 'linear-gradient(-45deg, rgba(188, 236, 211, 1) 0%, rgba(100, 216, 198, 1) 100%)',
          }}
        >
          {/* 内側ボタン */}
          <button
            onClick={() => onOpenChat()}
            className={`w-full bg-white rounded-[48px] flex items-center justify-center gap-2
              transition-all duration-300 hover:opacity-90
              ${isExpanded ? 'h-14 px-6' : 'h-[35px] px-4'}`}
          >
            <MessageCircle
              className={`text-[#64D8C6] transition-all duration-200 ${
                isExpanded ? 'w-5 h-5' : 'w-4 h-4'
              }`}
            />
            <span
              className={`font-bold text-gray-800 whitespace-nowrap transition-all duration-200 ${
                isExpanded ? 'text-base opacity-100' : 'text-xs opacity-0 w-0'
              }`}
            >
              {isExpanded && (
                <span className="inline-block animate-fade-in">
                  わからないことをAIに質問する
                </span>
              )}
              {!isExpanded && (
                <span className="inline-block animate-fade-in">
                  AIに質問
                </span>
              )}
            </span>
          </button>
        </div>
      </div>
    )
  }
)

FixedChatButton.displayName = 'FixedChatButton'
