'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { TextSelectionWrapper } from '@/features/chat/TextSelectionWrapper'
import { FixedChatButton, FixedChatButtonRef } from '@/features/chat/FixedChatButton'
import { ModalChatWindow } from '@/features/chat/ModalChatWindow'
import { EnhancedDifficultyToggle } from '@/features/difficulty/EnhancedDifficultyToggle'
import type { Country } from '@/lib/dataUtils'

interface CountryDetailClientProps {
  country: Country
}

/**
 * 国詳細ページのクライアントコンポーネント
 *
 * @param props - コンポーネントのprops
 * @returns 国詳細ページのUI
 */
export function CountryDetailClient({ country }: CountryDetailClientProps) {
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

  // 脅威レベルに応じた色を取得
  const getThreatColor = (level: string) => {
    if (level.includes('非常に高い') || level.includes('戦争状態')) {
      return 'bg-red-600 text-white'
    }
    if (level.includes('高')) {
      return 'bg-red-500 text-white'
    }
    if (level.includes('中')) {
      return 'bg-yellow-500 text-white'
    }
    return 'bg-green-500 text-white'
  }

  return (
    <>
      <TextSelectionWrapper onTextSelect={handleTextSelect}>
        <div className="container mx-auto pb-8 max-w-4xl px-4">
          {/* ヘッダー */}
          <div className="my-8 border-b pb-6">
            <h1 className="text-4xl font-bold mb-3">{country.name.ja}</h1>
            <p className="text-xl text-gray-600 mb-4">{country.name.en}</p>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getThreatColor(country.threatLevel)}`}>
                脅威レベル: {country.threatLevel}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {country.region}
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                最終更新: {country.lastUpdated}
              </span>
            </div>
          </div>

          {/* わかりやすい解説 */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">💡 概要</h2>
            <EnhancedDifficultyToggle
              simpleText={country.summary}
              detailedText={
                country.currentSituation?.overview
                  ? `${country.summary}\n\n${country.currentSituation.overview}`
                  : country.summary
              }
            />
          </section>

          {/* 現在の状況 */}
          {country.currentSituation && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">📊 現在の状況</h2>
              <div className="space-y-4">
                {country.currentSituation.overview && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{country.currentSituation.overview}</p>
                  </div>
                )}

                {country.currentSituation.keyDevelopments && country.currentSituation.keyDevelopments.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-2">主要な動向</h3>
                    <ul className="space-y-2">
                      {country.currentSituation.keyDevelopments.map((dev, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{dev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {country.currentSituation.threatAssessment && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-bold mb-2">⚠️ 脅威評価</h3>
                    <p className="text-gray-700">{country.currentSituation.threatAssessment}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 活動組織 */}
          {(country.activeOrganizations || country.governingOrganization) && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">🎯 関連組織</h2>
              <div className="space-y-4">
                {country.governingOrganization && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-bold mb-2 text-red-800">統治組織</h3>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/organizations/${country.governingOrganization}`}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        {country.governingOrganization}
                      </Link>
                    </div>
                  </div>
                )}

                {country.activeOrganizations && country.activeOrganizations.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-bold mb-2">活動中の組織</h3>
                    <div className="flex flex-wrap gap-2">
                      {country.activeOrganizations.map((orgId) => (
                        <Link
                          key={orgId}
                          href={`/organizations/${orgId}`}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition"
                        >
                          {orgId}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {country.dismantledOrganizations && country.dismantledOrganizations.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-bold mb-2">壊滅した組織</h3>
                    <div className="flex flex-wrap gap-2">
                      {country.dismantledOrganizations.map((orgId) => (
                        <Link
                          key={orgId}
                          href={`/organizations/${orgId}`}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200 transition"
                        >
                          {orgId}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {country.historicalOrganizations && country.historicalOrganizations.length > 0 && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-bold mb-2">歴史的組織</h3>
                    <div className="flex flex-wrap gap-2">
                      {country.historicalOrganizations.map((orgId) => (
                        <Link
                          key={orgId}
                          href={`/organizations/${orgId}`}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-200 transition"
                        >
                          {orgId}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 対テロ対策 */}
          {country.counterTerrorismEfforts && country.counterTerrorismEfforts.length > 0 && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">🛡️ 対テロ対策</h2>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <ul className="space-y-2">
                  {country.counterTerrorismEfforts.map((effort, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>{effort}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* 主要事件 */}
          {country.majorEvents && country.majorEvents.length > 0 && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">📅 主要事件</h2>
              <div className="space-y-3">
                {country.majorEvents
                  .sort((a, b) => b.year - a.year)
                  .map((event, i) => (
                    <div key={i} className="p-4 border-l-4 border-blue-500 bg-gray-50">
                      <div className="flex items-baseline gap-3">
                        <span className="font-bold text-blue-600">{event.year}</span>
                        <span className="text-gray-700">{event.event}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* 信頼性情報 */}
          {country.sources && country.sources.length > 0 && (
            <section className="my-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">🏆 情報の信頼性</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-bold">信頼性ランク: </span>
                  <span
                    className={`px-3 py-1 rounded ${
                      country.credibility === 'tier1' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                    }`}
                  >
                    {country.credibility === 'tier1' ? '最高' : '高'}
                  </span>
                </div>
                <div>
                  <p className="font-bold mb-2">主要な情報源:</p>
                  <ul className="space-y-1">
                    {country.sources.map((source) => (
                      <li key={source} className="text-sm text-gray-700">
                        • {source}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* 注意事項 */}
          <section className="my-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">⚠️ ご注意</h3>
            <p className="text-sm text-gray-700">
              この情報は公開情報と専門家の分析に基づいていますが、各国の治安状況は複雑で流動的です。
              必ずしも完全な正確性を保証するものではありません。教育・研究目的でご利用ください。
            </p>
          </section>

          {/* ナビゲーション */}
          <div className="mt-8 pt-8 border-t">
            <Link
              href="/countries"
              className="inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition"
            >
              ← 国一覧に戻る
            </Link>
          </div>
        </div>
      </TextSelectionWrapper>

      {/* 固定チャットボタン（モバイルのみ） */}
      <FixedChatButton
        ref={chatButtonRef}
        organizationName={`${country.name.ja}の情勢`}
        onOpenChat={handleOpenChat}
      />

      {/* モーダルチャットウィンドウ */}
      <ModalChatWindow
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false)
          setInitialMessage(undefined)
        }}
        organizationName={`${country.name.ja}の情勢`}
        initialMessage={initialMessage}
      />
    </>
  )
}
