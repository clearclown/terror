'use client'

import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionLineType,
} from 'reactflow'
import 'reactflow/dist/style.css'

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

interface OrganizationGraphProps {
  relationships: Relationship[]
  relationshipTypes: Record<string, RelationshipType>
  organizations: Array<{
    id: string
    name: { ja: string; en: string }
  }>
}

// タイムライン用の年代グループ
const DECADES = [1960, 1970, 1980, 1990, 2000, 2010, 2020, 2030]

export function OrganizationGraph({
  relationships,
  relationshipTypes,
  organizations,
}: OrganizationGraphProps) {
  // 組織を年代別にグループ化して配置
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const orgMap = new Map(organizations.map(org => [org.id, org]))
    const orgPositions = new Map<string, { x: number; y: number; year: number }>()

    // 各組織の最初の登場年を計算
    const orgFirstAppearance = new Map<string, number>()

    relationships.forEach(rel => {
      if (!orgFirstAppearance.has(rel.from)) {
        orgFirstAppearance.set(rel.from, rel.year - 10) // 推定: 関係の10年前に設立
      }
      if (!orgFirstAppearance.has(rel.to)) {
        orgFirstAppearance.set(rel.to, rel.year)
      }
    })

    // 年代ごとにX座標を計算 (横軸 = 時間)
    const getXPosition = (year: number) => {
      const minYear = 1960
      const maxYear = 2030
      const width = 1400
      return ((year - minYear) / (maxYear - minYear)) * width + 100
    }

    // 各年代ごとの組織数をカウントしてY座標を割り当て
    const orgsByDecade = new Map<number, string[]>()

    Array.from(orgFirstAppearance.entries()).forEach(([orgId, year]) => {
      const decade = Math.floor(year / 10) * 10
      if (!orgsByDecade.has(decade)) {
        orgsByDecade.set(decade, [])
      }
      orgsByDecade.get(decade)!.push(orgId)
    })

    // Y座標を割り当て (縦軸 = 組織の配置)
    let globalIndex = 0
    orgsByDecade.forEach((orgs, decade) => {
      orgs.forEach((orgId, index) => {
        const year = orgFirstAppearance.get(orgId) || decade
        orgPositions.set(orgId, {
          x: getXPosition(year),
          y: globalIndex * 120 + 50,
          year,
        })
        globalIndex++
      })
    })

    // ノード生成
    const nodes: Node[] = Array.from(orgPositions.entries()).map(([orgId, pos]) => {
      const org = orgMap.get(orgId)
      return {
        id: orgId,
        type: 'default',
        position: { x: pos.x, y: pos.y },
        data: {
          label: (
            <div className="text-center">
              <div className="font-bold text-sm">{org?.name.ja || orgId}</div>
              <div className="text-xs text-gray-500">{pos.year}</div>
            </div>
          ),
        },
        style: {
          background: '#ffffff',
          border: '2px solid #3b82f6',
          borderRadius: 8,
          padding: 10,
          minWidth: 150,
        },
      }
    })

    // エッジ生成
    const edges: Edge[] = relationships.map(rel => {
      const relType = relationshipTypes[rel.type]
      return {
        id: rel.id,
        source: rel.from,
        target: rel.to,
        type: ConnectionLineType.SmoothStep,
        animated: rel.type === 'conflict',
        style: {
          stroke: relType.color,
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: relType.color,
        },
        label: `${relType.ja} (${rel.year})`,
        labelStyle: {
          fill: relType.color,
          fontWeight: 600,
          fontSize: 12,
        },
        labelBgStyle: {
          fill: '#ffffff',
          fillOpacity: 0.8,
        },
      }
    })

    return { nodes, edges }
  }, [relationships, relationshipTypes, organizations])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="w-full h-[800px] bg-gray-50 rounded-lg border">
      {/* 凡例 */}
      <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg border">
        <h4 className="font-bold text-sm mb-2">関係性の種類</h4>
        <div className="space-y-1">
          {Object.entries(relationshipTypes).map(([key, type]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: type.color }}
              />
              <span className="font-medium">{type.ja}</span>
              <span className="text-gray-500">({type.en})</span>
            </div>
          ))}
        </div>
      </div>

      {/* タイムライン軸 */}
      <div className="absolute bottom-4 left-0 right-0 z-10 px-20">
        <div className="bg-white/90 p-2 rounded-lg shadow-lg border">
          <div className="flex justify-between items-center text-xs font-medium text-gray-600">
            {DECADES.map(decade => (
              <div key={decade} className="text-center">
                <div className="font-bold">{decade}s</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        minZoom={0.1}
        maxZoom={1.5}
        defaultEdgeOptions={{
          type: ConnectionLineType.SmoothStep,
        }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => '#3b82f6'}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{
            backgroundColor: '#ffffff',
          }}
        />
      </ReactFlow>
    </div>
  )
}
