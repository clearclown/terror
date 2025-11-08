'use client'

import Link from 'next/link'

interface Relationship {
  id: string
  from: string
  to: string
  type: 'split' | 'succession' | 'alliance' | 'conflict' | 'merger'
  year: number
  description: string
}

interface RelationshipType {
  ja: string
  en: string
  color: string
  description: string
}

interface OrganizationRelationshipCardProps {
  organizationId: string
  organizationName: string
  relationships: Relationship[]
  relationshipTypes: Record<string, RelationshipType>
  organizations: Array<{
    id: string
    name: { ja: string; en: string }
  }>
}

export function OrganizationRelationshipCard({
  organizationId,
  organizationName,
  relationships,
  relationshipTypes,
  organizations,
}: OrganizationRelationshipCardProps) {
  // この組織に関連する関係性をフィルタリング
  const relevantRelationships = relationships.filter(
    (rel) => rel.from === organizationId || rel.to === organizationId
  )

  if (relevantRelationships.length === 0) {
    return null
  }

  const orgMap = new Map(organizations.map((org) => [org.id, org]))

  // 関係を種類別に分類
  const relationshipsByType = {
    incoming: relevantRelationships.filter((rel) => rel.to === organizationId),
    outgoing: relevantRelationships.filter((rel) => rel.from === organizationId),
  }

  const getOrgName = (id: string) => {
    return orgMap.get(id)?.name.ja || id
  }

  const getRelationIcon = (type: string) => {
    switch (type) {
      case 'split':
        return '↗️'
      case 'succession':
        return '👥'
      case 'alliance':
        return '🤝'
      case 'conflict':
        return '⚔️'
      case 'merger':
        return '🔗'
      default:
        return '•'
    }
  }

  return (
    <div className="space-y-4">
      {/* 上流（元となった組織） */}
      {relationshipsByType.incoming.length > 0 && (
        <div className="border rounded-lg p-4">
          <h4 className="font-bold mb-3 text-sm text-gray-600">
            ← {organizationName}への影響
          </h4>
          <div className="space-y-2">
            {relationshipsByType.incoming.map((rel) => {
              const relType = relationshipTypes[rel.type]
              return (
                <Link
                  key={rel.id}
                  href={`/organizations/${rel.from}`}
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded transition"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getRelationIcon(rel.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{getOrgName(rel.from)}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: relType.color + '20',
                            color: relType.color,
                          }}
                        >
                          {relType.ja}
                        </span>
                        <span className="text-xs text-gray-500">{rel.year}</span>
                      </div>
                      <p className="text-sm text-gray-600">{rel.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* 下流（この組織から派生した組織） */}
      {relationshipsByType.outgoing.length > 0 && (
        <div className="border rounded-lg p-4">
          <h4 className="font-bold mb-3 text-sm text-gray-600">
            {organizationName}からの影響 →
          </h4>
          <div className="space-y-2">
            {relationshipsByType.outgoing.map((rel) => {
              const relType = relationshipTypes[rel.type]
              return (
                <Link
                  key={rel.id}
                  href={`/organizations/${rel.to}` as any}
                  className="block p-3 bg-gray-50 hover:bg-gray-100 rounded transition"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getRelationIcon(rel.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">{getOrgName(rel.to)}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: relType.color + '20',
                            color: relType.color,
                          }}
                        >
                          {relType.ja}
                        </span>
                        <span className="text-xs text-gray-500">{rel.year}</span>
                      </div>
                      <p className="text-sm text-gray-600">{rel.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* 全体図へのリンク */}
      <Link
        href="/organizations/relationships"
        className="block text-center p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 font-medium text-sm transition"
      >
        📊 全体の関係図を見る
      </Link>
    </div>
  )
}
