'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { TextSelectionWrapper } from '@/features/chat/TextSelectionWrapper'
import { FixedChatButton, FixedChatButtonRef } from '@/features/chat/FixedChatButton'
import { ModalChatWindow } from '@/features/chat/ModalChatWindow'
import { EnhancedDifficultyToggle } from '@/features/difficulty/EnhancedDifficultyToggle'

interface Event {
  id: string
  date: string
  title: {
    ja: string
    en: string
  }
  organization: string
  branch?: string
  location: {
    country: string
    cities?: string[]
    region?: string
  }
  casualties?: {
    deaths?: number
    injured?: number | string
    kidnapped?: number
    hostages?: number
    note?: string
    hezbollahOfficialDeaths?: number
    idfEstimate?: number
    israeliDeaths?: number
  }
  type: string
  duration?: string
  significance: string
  description?: string
  aftermath?: string[]
  credibility: string
  sources: string[]
  strategicImportance?: string
  context?: string[]
  context2025?: string[]
  timeline?: string[]
  economicImpact?: string
}

interface EventDetailClientProps {
  event: Event
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | undefined>()
  const chatButtonRef = useRef<FixedChatButtonRef>(null)

  const handleTextSelect = (text: string) => {
    chatButtonRef.current?.openWithText(text)
    setIsChatOpen(true)
  }

  const handleOpenChat = (message?: string) => {
    setInitialMessage(message)
    setIsChatOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <TextSelectionWrapper onTextSelect={handleTextSelect}>
        <div className="container mx-auto pb-8 max-w-4xl px-4">
          {/* ヘッダー */}
          <div className="my-8 border-b pb-6">
            <h1 className="text-4xl font-bold mb-3">{event.title.ja}</h1>
            <p className="text-xl text-gray-600 mb-4">{event.title.en}</p>
            <div className="flex gap-2 flex-wrap items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {formatDate(event.date)}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {event.type}
              </span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                {event.location.country}
              </span>
              {event.location.cities && event.location.cities.length > 0 && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {event.location.cities.join(', ')}
                </span>
              )}
              {event.branch && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  {event.branch}
                </span>
              )}
            </div>
            {event.duration && (
              <div className="mt-3 text-sm text-gray-600">
                <span className="font-bold">期間: </span>
                {event.duration}
              </div>
            )}
          </div>

          {/* わかりやすい解説 */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">💡 わかりやすい解説</h2>
            <EnhancedDifficultyToggle
              simpleText={event.significance}
              detailedText={event.description || '情報なし'}
            />
          </section>

          {/* 関連組織 */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">🏢 関連組織</h2>
            <Link
              href={`/organizations/${event.organization}` as any}
              className="block p-4 bg-gray-50 hover:bg-gray-100 border rounded-lg transition"
            >
              <div className="font-bold text-lg">組織の詳細を見る →</div>
              {event.branch && (
                <div className="text-sm text-gray-600 mt-1">支部/分派: {event.branch}</div>
              )}
            </Link>
          </section>

          {/* 事件の詳細 */}
          {event.description && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">📋 事件の詳細</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            </section>
          )}

          {/* 犠牲者情報 */}
          {event.casualties && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">💔 犠牲者情報</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {event.casualties.deaths !== undefined && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-bold text-red-800 mb-2">死者</h3>
                    <p className="text-2xl font-bold text-red-600">{event.casualties.deaths.toLocaleString()}人</p>
                  </div>
                )}
                {event.casualties.injured !== undefined && (
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h3 className="font-bold text-orange-800 mb-2">負傷者</h3>
                    <p className="text-2xl font-bold text-orange-600">
                      {typeof event.casualties.injured === 'number'
                        ? `${event.casualties.injured.toLocaleString()}人`
                        : event.casualties.injured}
                    </p>
                  </div>
                )}
                {event.casualties.kidnapped !== undefined && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-bold text-yellow-800 mb-2">拉致された人数</h3>
                    <p className="text-2xl font-bold text-yellow-600">{event.casualties.kidnapped.toLocaleString()}人</p>
                  </div>
                )}
                {event.casualties.hostages !== undefined && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-bold text-purple-800 mb-2">人質</h3>
                    <p className="text-2xl font-bold text-purple-600">{event.casualties.hostages.toLocaleString()}人</p>
                  </div>
                )}
              </div>
              {event.casualties.note && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700">{event.casualties.note}</p>
                </div>
              )}
            </section>
          )}

          {/* 歴史的意義 */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">⭐ 歴史的意義</h2>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{event.significance}</p>
            </div>
          </section>

          {/* 余波・影響 */}
          {event.aftermath && event.aftermath.length > 0 && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">🌊 余波・影響</h2>
              <div className="space-y-3">
                {event.aftermath.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold mt-1">{index + 1}.</span>
                      <p className="text-gray-700 flex-1">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* タイムライン */}
          {event.timeline && event.timeline.length > 0 && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">⏱️ タイムライン</h2>
              <div className="p-4 border rounded-lg">
                <ul className="space-y-2">
                  {event.timeline.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">▸</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* 文脈情報 */}
          {((event.context && event.context.length > 0) ||
            (event.context2025 && event.context2025.length > 0)) && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">🌍 文脈情報</h2>
              <div className="space-y-4">
                {event.context && event.context.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <ul className="space-y-2">
                      {event.context.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {event.context2025 && event.context2025.length > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold mb-2">2025年の状況</h3>
                    <ul className="space-y-2">
                      {event.context2025.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 戦略的重要性 */}
          {event.strategicImportance && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">🎯 戦略的重要性</h2>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-gray-700">{event.strategicImportance}</p>
              </div>
            </section>
          )}

          {/* 経済的影響 */}
          {event.economicImpact && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">💰 経済的影響</h2>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-gray-700">{event.economicImpact}</p>
              </div>
            </section>
          )}

          {/* 信頼性評価 */}
          <section className="my-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">🏆 情報の信頼性</h2>
            <div className="space-y-3">
              <div>
                <span className="font-bold">信頼性ランク: </span>
                <span
                  className={`px-3 py-1 rounded ${
                    event.credibility === 'tier1'
                      ? 'bg-green-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  {event.credibility === 'tier1' ? '最高' : '高'}
                </span>
              </div>
              <div>
                <p className="font-bold mb-2">主要な情報源:</p>
                <ul className="space-y-1">
                  {event.sources.map((source, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {source}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 注意事項 */}
          <section className="my-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">⚠️ ご注意</h3>
            <p className="text-sm text-gray-700">
              この情報は公開情報と専門家の分析に基づいていますが、テロ事件の詳細は複雑で流動的です。
              必ずしも完全な正確性を保証するものではありません。教育・研究目的でご利用ください。
            </p>
          </section>

          {/* 戻るリンク */}
          <div className="my-8">
            <Link
              href="/events"
              className="inline-block px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
            >
              ← 事件一覧に戻る
            </Link>
          </div>
        </div>
      </TextSelectionWrapper>

      {/* 固定チャットボタン（モバイルのみ） */}
      <FixedChatButton
        ref={chatButtonRef}
        organizationName={event.title.ja}
        onOpenChat={handleOpenChat}
      />

      {/* モーダルチャットウィンドウ */}
      <ModalChatWindow
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false)
          setInitialMessage(undefined)
        }}
        organizationName={event.title.ja}
        initialMessage={initialMessage}
      />
    </>
  )
}
