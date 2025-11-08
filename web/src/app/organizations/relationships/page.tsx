'use client'

import { useState } from 'react'
import { OrganizationGraph } from '@/features/organizations/OrganizationGraph'
import relationshipsData from '@/data/relationships.json'
import organizationsData from '@/data/organizations.json'
import { ChevronDown, ChevronUp } from 'lucide-react'

function CollapsibleTimeline({ timeline }: { timeline: Record<string, string[]> }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-8 bg-white border rounded-lg p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full font-bold text-lg mb-4 hover:text-blue-600 transition-colors"
      >
        <span>📅 年代別の主な出来事</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="space-y-4">
          {Object.entries(timeline).map(([decade, events]) => (
            <div key={decade}>
              <h4 className="font-bold text-blue-600 mb-1">{decade}</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {(events as string[]).map((event, idx) => (
                  <li key={idx}>{event}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RelationshipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">組織間の関係図</h1>
        <p className="text-gray-600 text-lg">
          テロ組織や武装グループがどのように分派、継承、対立、提携してきたかを時系列で視覚化しています。
        </p>
      </div>

      {/* 説明セクション */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-2">📊 グラフの見方</h2>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>
            <strong>横軸 (左→右):</strong> 時間の流れ (1960年代〜2020年代)
          </li>
          <li>
            <strong>縦軸 (上→下):</strong> 各組織の配置
          </li>
          <li>
            <strong>矢印の色:</strong> 関係性の種類を表します (右上の凡例を参照)
          </li>
          <li>
            <strong>操作:</strong> マウスホイールでズーム、ドラッグで移動できます
          </li>
        </ul>
      </div>

      {/* グラフ */}
      <OrganizationGraph
        relationships={relationshipsData.relationships as any}
        relationshipTypes={relationshipsData.relationshipTypes}
        organizations={organizationsData.organizations.map((org) => ({
          id: org.id,
          name: org.name,
        }))}
      />

      {/* 詳細説明 */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3">🔄 主な分派の流れ</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>フィリピン:</strong> MNLF → MILF (1977) → BIFF (2010)
            </li>
            <li>
              <strong>中東:</strong> Al-Qaeda → ISIS (2013) → IS-K / ISEA
            </li>
            <li>
              <strong>アフリカ:</strong> Boko Haram → ISWAP (2016)
            </li>
            <li>
              <strong>東南アジア:</strong> Jemaah Islamiyah → JAD (2014)
            </li>
          </ul>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-3">⚔️ 主な対立関係</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <strong>ISIS vs Al-Qaeda:</strong> 2014年以降、激しく対立
            </li>
            <li>
              <strong>Taliban vs IS-K:</strong> アフガニスタンで武力衝突
            </li>
            <li>
              <strong>Boko Haram vs ISWAP:</strong> ナイジェリアで分派後に対立
            </li>
          </ul>
        </div>
      </div>

      {/* タイムライン（折りたたみ可能） */}
      <CollapsibleTimeline timeline={relationshipsData.timeline} />

      {/* 注意事項 */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-bold mb-2">⚠️ ご注意</h3>
        <p className="text-sm text-gray-700">
          この関係図は公開情報と専門家の分析に基づいていますが、テロ組織の関係性は複雑で流動的です。
          必ずしも完全な正確性を保証するものではありません。詳細な情報は各組織のページをご覧ください。
        </p>
      </div>
    </div>
  )
}
