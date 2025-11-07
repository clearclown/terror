'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { LatLngExpression } from 'leaflet'

// Leafletはクライアントサイドのみで動作するため動的インポート
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
)

interface Organization {
  id: string
  name: {
    ja: string
    en: string
  }
  region: string
  primaryCountries: string[]
  status: string
  location?: {
    lat: number
    lng: number
    label?: string
  }
}

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

interface OrganizationMapProps {
  organizations: Organization[]
  relationships: Relationship[]
  relationshipTypes: Record<string, RelationshipType>
}

export function OrganizationMap({
  organizations,
  relationships,
  relationshipTypes,
}: OrganizationMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 座標を持つ組織のみフィルタリング
  const orgsWithLocation = organizations.filter((org) => org.location)

  // 組織IDから座標を取得するマップ
  const orgLocationMap = new Map(
    orgsWithLocation.map((org) => [org.id, org.location!])
  )

  // 関係性を地図上の線として描画するデータ
  const relationshipLines = relationships
    .filter((rel) => {
      const fromLoc = orgLocationMap.get(rel.from)
      const toLoc = orgLocationMap.get(rel.to)
      return fromLoc && toLoc
    })
    .map((rel) => {
      const fromLoc = orgLocationMap.get(rel.from)!
      const toLoc = orgLocationMap.get(rel.to)!
      const relType = relationshipTypes[rel.type]

      return {
        id: rel.id,
        positions: [
          [fromLoc.lat, fromLoc.lng] as LatLngExpression,
          [toLoc.lat, toLoc.lng] as LatLngExpression,
        ],
        color: relType.color,
        type: relType.ja,
        year: rel.year,
        description: rel.description,
        animated: rel.type === 'conflict', // 対立関係はアニメーション
      }
    })

  if (!isClient) {
    return (
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">地図を読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* 凡例 */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <h3 className="font-bold text-sm mb-3">🗺️ 組織の地理的分布と関係性</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(relationshipTypes).map(([key, type]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-0.5 flex-shrink-0"
                style={{ backgroundColor: type.color }}
              />
              <span className="text-xs font-medium">{type.ja}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 マーカーをクリックすると組織情報が表示されます。線は組織間の関係を示しています。
        </p>
      </div>

      {/* 地図 */}
      <div className="relative w-full h-[600px] rounded-lg overflow-hidden border shadow-lg">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 関係性の線 */}
          {relationshipLines.map((line) => (
            <Polyline
              key={line.id}
              positions={line.positions}
              pathOptions={{
                color: line.color,
                weight: 3,
                opacity: 0.7,
                dashArray: line.animated ? '10, 10' : undefined,
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-bold" style={{ color: line.color }}>
                    {line.type} ({line.year})
                  </div>
                  <div className="text-gray-600 text-xs mt-1">{line.description}</div>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* 組織のマーカー */}
          {orgsWithLocation.map((org) => (
            <Marker
              key={org.id}
              position={[org.location!.lat, org.location!.lng]}
            >
              <Popup>
                <div className="text-sm space-y-1">
                  <div className="font-bold text-base">{org.name.ja}</div>
                  <div className="text-gray-600">{org.name.en}</div>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {org.region}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                      {org.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    📍 {org.location?.label || org.primaryCountries.join(', ')}
                  </div>
                  <a
                    href={`/organizations/${org.id}`}
                    className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    詳細を見る →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-blue-600">{organizations.length}</div>
          <div className="text-xs text-gray-600 mt-1">総組織数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-green-600">{orgsWithLocation.length}</div>
          <div className="text-xs text-gray-600 mt-1">地図上の組織</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-purple-600">{relationships.length}</div>
          <div className="text-xs text-gray-600 mt-1">組織間関係</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-orange-600">
            {relationshipLines.length}
          </div>
          <div className="text-xs text-gray-600 mt-1">可視化された関係</div>
        </div>
      </div>
    </div>
  )
}
