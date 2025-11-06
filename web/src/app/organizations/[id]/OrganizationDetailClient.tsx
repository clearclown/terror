'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { TextSelectionWrapper } from '@/features/chat/TextSelectionWrapper'
import { FixedChatButton, FixedChatButtonRef } from '@/features/chat/FixedChatButton'
import { ModalChatWindow } from '@/features/chat/ModalChatWindow'
import { EnhancedDifficultyToggle } from '@/features/difficulty/EnhancedDifficultyToggle'

interface Organization {
  id: string
  name: { ja: string; en: string }
  status: string
  region: string
  founded?: string
  currentStatus: {
    summary: string
    keyDevelopments: string[]
  }
  background: {
    origin: string
    objectives: string
    notableEvents?: string[]
  }
  estimatedMembers?: {
    current: string
    peak?: string
    lastUpdated: string
  }
  primaryCountries: string[]
  activeLocations: string[]
  credibilityAssessment: {
    sourceTier: string
    verificationLevel: string
    reliabilitySources: string[]
  }
  relatedOrganizations?: string[]
}

interface Relationship {
  id: string
  from: string
  to: string
  type: string
  year: number
  description: string
}

interface OrganizationDetailClientProps {
  organization: Organization
  relationships: Relationship[]
  allOrganizations: Array<{ id: string; name: { ja: string; en: string } }>
}

export function OrganizationDetailClient({
  organization: org,
  relationships,
  allOrganizations,
}: OrganizationDetailClientProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | undefined>()
  const chatButtonRef = useRef<FixedChatButtonRef>(null)

  const handleTextSelect = (text: string) => {
    // テキスト選択時にチャットボタン経由で開く
    chatButtonRef.current?.openWithText(text)
    setIsChatOpen(true)
  }

  const handleOpenChat = (message?: string) => {
    setInitialMessage(message)
    setIsChatOpen(true)
  }

  const orgMap = new Map(allOrganizations.map((o) => [o.id, o]))

  return (
    <>
      <TextSelectionWrapper onTextSelect={handleTextSelect}>
        <div className="container mx-auto pb-8 max-w-4xl px-4">
          {/* ヘッダー */}
          <div className="my-8 border-b pb-6">
            <h1 className="text-4xl font-bold mb-3">{org.name.ja}</h1>
            <p className="text-xl text-gray-600 mb-4">{org.name.en}</p>
            <div className="flex gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  org.status.includes('活動')
                    ? 'bg-red-100 text-red-800'
                    : org.status.includes('弱体化')
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {org.status}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {org.region}
              </span>
              {org.founded && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  設立: {org.founded}
                </span>
              )}
            </div>
          </div>

          {/* わかりやすい解説 */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">💡 わかりやすい解説</h2>
            <EnhancedDifficultyToggle
              simpleText={org.currentStatus.summary}
              detailedText={`${org.background.origin} ${org.background.objectives}`}
            />
          </section>

          {/* 現在の状況 */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">📊 現在の状況</h2>
            <div className="space-y-4">
              {org.estimatedMembers && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-2">推定メンバー数</h3>
                  <p className="text-lg">{org.estimatedMembers.current}</p>
                  {org.estimatedMembers.peak && (
                    <p className="text-sm text-gray-600 mt-1">最盛期: {org.estimatedMembers.peak}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    最終更新: {org.estimatedMembers.lastUpdated}
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold mb-2">主要な動向</h3>
                <ul className="space-y-2">
                  {org.currentStatus.keyDevelopments.map((dev, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{dev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 背景情報 */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">📖 背景情報</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-2">起源</h3>
                <p className="text-gray-700">{org.background.origin}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-2">目的</h3>
                <p className="text-gray-700">{org.background.objectives}</p>
              </div>
              {org.background.notableEvents && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-bold mb-2">主要な出来事</h3>
                  <ul className="space-y-2">
                    {org.background.notableEvents.map((event, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">▸</span>
                        <span className="text-gray-700">{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* 活動地域 */}
          <section className="my-8">
            <h2 className="text-2xl font-bold mb-4">🗺️ 活動地域</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-2">主な国</h3>
                <div className="flex flex-wrap gap-2">
                  {org.primaryCountries.map((country) => (
                    <span key={country} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {country}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold mb-2">具体的な地域</h3>
                <div className="flex flex-wrap gap-2">
                  {org.activeLocations.map((loc) => (
                    <span key={loc} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {loc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 関係性 */}
          {relationships.length > 0 && (
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4">🔗 組織間の関係</h2>
              <div className="space-y-2">
                {relationships.map((rel) => {
                  const isFrom = rel.from === org.id
                  const otherOrgId = isFrom ? rel.to : rel.from
                  const otherOrg = orgMap.get(otherOrgId)
                  if (!otherOrg) return null

                  return (
                    <Link
                      key={rel.id}
                      href={`/organizations/${otherOrgId}`}
                      className="block p-3 bg-gray-50 hover:bg-gray-100 rounded transition"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{otherOrg.name.ja}</span>
                        <span className="text-xs text-gray-500">({rel.year})</span>
                      </div>
                      <p className="text-sm text-gray-600">{rel.description}</p>
                    </Link>
                  )
                })}
              </div>
              <Link
                href="/organizations/relationships"
                className="block mt-4 text-center p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-medium text-sm transition"
              >
                📊 全体の関係図を見る
              </Link>
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
                    org.credibilityAssessment.sourceTier === 'tier1'
                      ? 'bg-green-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  {org.credibilityAssessment.sourceTier === 'tier1' ? '最高' : '高'}
                </span>
              </div>
              <div>
                <span className="font-bold">検証レベル: </span>
                <span>{org.credibilityAssessment.verificationLevel}</span>
              </div>
              <div>
                <p className="font-bold mb-2">主要な情報源:</p>
                <ul className="space-y-1">
                  {org.credibilityAssessment.reliabilitySources.map((source) => (
                    <li key={source} className="text-sm text-gray-700">
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
              この情報は公開情報と専門家の分析に基づいていますが、テロ組織の状況は複雑で流動的です。
              必ずしも完全な正確性を保証するものではありません。教育・研究目的でご利用ください。
            </p>
          </section>
        </div>
      </TextSelectionWrapper>

      {/* 固定チャットボタン（モバイルのみ） */}
      <FixedChatButton
        ref={chatButtonRef}
        organizationName={org.name.ja}
        onOpenChat={handleOpenChat}
      />

      {/* モーダルチャットウィンドウ */}
      <ModalChatWindow
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false)
          setInitialMessage(undefined)
        }}
        organizationName={org.name.ja}
        initialMessage={initialMessage}
      />
    </>
  )
}
