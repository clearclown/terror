import { OrganizationMap } from '@/features/organizations/OrganizationMap'
import organizationsData from '@/data/organizations.json'

// 関係性のタイプ定義
const relationshipTypes = {
  split: {
    ja: '分裂',
    en: 'Split',
    color: '#f97316', // オレンジ
    description: '組織からの分裂・独立',
  },
  succession: {
    ja: '継承',
    en: 'Succession',
    color: '#3b82f6', // 青
    description: '組織の継承・後継',
  },
  alliance: {
    ja: '同盟',
    en: 'Alliance',
    color: '#10b981', // 緑
    description: '協力・同盟関係',
  },
  conflict: {
    ja: '対立',
    en: 'Conflict',
    color: '#ef4444', // 赤
    description: '敵対・紛争関係',
  },
  merger: {
    ja: '統合',
    en: 'Merger',
    color: '#8b5cf6', // 紫
    description: '組織の統合・合併',
  },
}

// 主要組織に地理的座標を追加（実際のデータは後で追加）
const organizationsWithLocation = organizationsData.organizations.map((org: any) => {
  // 主要組織の座標を設定（例）
  const locations: Record<string, { lat: number; lng: number; label?: string }> = {
    // 中東
    'hts': { lat: 36.2, lng: 37.15, label: 'イドリブ, シリア' },
    'hezbollah': { lat: 33.9, lng: 35.5, label: 'レバノン南部' },
    'houthi': { lat: 15.3, lng: 44.2, label: 'サヌア, イエメン' },
    'aqap': { lat: 13.5, lng: 48.0, label: 'アビヤン, イエメン' },
    'kataib-hezbollah': { lat: 33.3, lng: 44.4, label: 'バグダッド, イラク' },
    'harakat-al-nujaba': { lat: 33.3, lng: 44.4, label: 'バグダッド, イラク' },
    'aah': { lat: 33.3, lng: 44.4, label: 'バグダッド, イラク' },
    'kss': { lat: 33.3, lng: 44.4, label: 'バグダッド, イラク' },
    'pij': { lat: 31.5, lng: 34.47, label: 'ガザ' },
    'al-aqsa-martyrs': { lat: 32.0, lng: 35.2, label: '西岸地区' },
    'pflp': { lat: 31.9, lng: 35.2, label: 'ヨルダン川西岸' },

    // アフリカ
    'al-shabaab': { lat: 2.04, lng: 45.34, label: 'モガディシュ, ソマリア' },
    'boko-haram': { lat: 11.85, lng: 13.16, label: 'マイドゥグリ, ナイジェリア' },
    'iswap': { lat: 12.5, lng: 14.0, label: 'チャド湖流域' },
    'ansaru': { lat: 10.5, lng: 7.4, label: 'カドゥナ, ナイジェリア' },
    'rsf': { lat: 13.5, lng: 25.5, label: 'ダルフール, スーダン' },
    'fdlr': { lat: -1.7, lng: 29.2, label: '北キブ, コンゴ' },
    'm23': { lat: -1.0, lng: 29.5, label: 'ゴマ, コンゴ' },
    'jnim': { lat: 17.0, lng: -4.0, label: 'マリ北部' },
    'aqim': { lat: 30.0, lng: 2.0, label: 'アルジェリア南部' },
    'adf': { lat: 0.5, lng: 30.0, label: 'ベニ, コンゴ' },

    // 南アジア
    'ttp': { lat: 34.0, lng: 70.5, label: 'ワズィーリスタン, パキスタン' },
    'iskp': { lat: 34.5, lng: 69.2, label: 'カブール, アフガニスタン' },
    'let': { lat: 34.0, lng: 74.8, label: 'カシミール' },
    'jem': { lat: 34.0, lng: 74.8, label: 'カシミール' },
    'hizbul-mujahideen': { lat: 34.0, lng: 74.8, label: 'カシミール' },
    'bla': { lat: 28.0, lng: 65.0, label: 'バロチスタン, パキスタン' },
    'lashkar-e-jhangvi': { lat: 30.2, lng: 66.9, label: 'クエッタ, パキスタン' },
    'naxalites': { lat: 20.3, lng: 82.7, label: 'チャッティースガル, インド' },
    'hizb-ut-tahrir': { lat: 41.3, lng: 69.2, label: 'タシケント, ウズベキスタン' },
    'jamaat-e-islami-bangladesh': { lat: 23.8, lng: 90.4, label: 'ダッカ, バングラデシュ' },

    // 東南アジア
    'asg': { lat: 6.1, lng: 121.1, label: 'スールー, フィリピン' },
    'maute': { lat: 8.0, lng: 124.3, label: 'マラウィ, フィリピン' },
    'biff': { lat: 6.9, lng: 124.9, label: 'ミンダナオ, フィリピン' },
    'ji': { lat: -6.2, lng: 106.8, label: 'ジャカルタ, インドネシア' },
    'jad': { lat: -6.2, lng: 106.8, label: 'ジャカルタ, インドネシア' },
    'npa': { lat: 14.6, lng: 121.0, label: 'ルソン島, フィリピン' },

    // 中東（トルコ・中央アジア）
    'pkk': { lat: 37.0, lng: 43.0, label: 'イラク北部（歴史的）' },

    // 南米
    'farc-emc': { lat: 2.5, lng: -72.5, label: 'コロンビア東部' },
    'eln': { lat: 7.9, lng: -72.5, label: 'コロンビア北東部' },
    'shining-path': { lat: -12.7, lng: -73.8, label: 'VRAEM, ペルー' },
  }

  return {
    ...org,
    location: locations[org.id],
  }
})

// 組織間の関係性データ（サンプル - 実際のデータは後で追加）
const relationships = [
  // アルカイダ系
  {
    id: 'aqap-al-shabaab',
    from: 'aqap',
    to: 'al-shabaab',
    type: 'alliance' as const,
    year: 2012,
    description: 'アルカイダ傘下での協力関係',
  },
  {
    id: 'aqap-aqim',
    from: 'aqap',
    to: 'aqim',
    type: 'alliance' as const,
    year: 2006,
    description: 'アルカイダ傘下での協力関係',
  },

  // ISIS系
  {
    id: 'boko-haram-iswap',
    from: 'boko-haram',
    to: 'iswap',
    type: 'split' as const,
    year: 2016,
    description: 'Shekauの過激な戦術への反対から分裂',
  },
  {
    id: 'iswap-boko-haram-conflict',
    from: 'iswap',
    to: 'boko-haram',
    type: 'conflict' as const,
    year: 2021,
    description: 'Shekau殺害とチャド湖領土争い',
  },

  // イラン系民兵
  {
    id: 'iran-hezbollah',
    from: 'kataib-hezbollah',
    to: 'hezbollah',
    type: 'alliance' as const,
    year: 2014,
    description: 'イラン支援の抵抗枢軸',
  },
  {
    id: 'kh-han',
    from: 'kataib-hezbollah',
    to: 'harakat-al-nujaba',
    type: 'alliance' as const,
    year: 2015,
    description: 'イラク・シーア派民兵同盟（IRI）',
  },
  {
    id: 'han-aah',
    from: 'harakat-al-nujaba',
    to: 'aah',
    type: 'alliance' as const,
    year: 2015,
    description: 'イラク・シーア派民兵同盟（IRI）',
  },

  // シリア
  {
    id: 'hts-alqaeda',
    from: 'hts',
    to: 'aqap',
    type: 'split' as const,
    year: 2017,
    description: 'アルカイダからの独立',
  },

  // パレスチナ
  {
    id: 'pij-hamas',
    from: 'pij',
    to: 'al-aqsa-martyrs',
    type: 'alliance' as const,
    year: 2023,
    description: 'Jenin Battalionでの協力',
  },
  {
    id: 'pflp-hamas',
    from: 'pflp',
    to: 'al-aqsa-martyrs',
    type: 'alliance' as const,
    year: 2023,
    description: 'ガザ戦争での協力',
  },

  // 南アジア
  {
    id: 'ttp-iskp',
    from: 'ttp',
    to: 'iskp',
    type: 'alliance' as const,
    year: 2020,
    description: 'パキスタン・アフガン国境での協力',
  },
  {
    id: 'lej-iskp',
    from: 'lashkar-e-jhangvi',
    to: 'iskp',
    type: 'alliance' as const,
    year: 2022,
    description: 'バロチスタンでの同盟',
  },

  // 東南アジア
  {
    id: 'asg-isis',
    from: 'asg',
    to: 'iswap',
    type: 'alliance' as const,
    year: 2014,
    description: 'ISIS忠誠（ISEA）',
  },
  {
    id: 'ji-jad',
    from: 'ji',
    to: 'jad',
    type: 'split' as const,
    year: 2015,
    description: '一部メンバーがISIS系JADに移籍',
  },

  // アフリカ
  {
    id: 'fdlr-m23-conflict',
    from: 'fdlr',
    to: 'm23',
    type: 'conflict' as const,
    year: 2022,
    description: 'コンゴ東部での領土争い',
  },
]

export default function OrganizationMapPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">🗺️ テロ組織の世界地図</h1>
        <p className="text-gray-600">
          世界中のテロ組織・武装グループの地理的分布と、組織間の関係性を地図上で可視化します。
          マーカーをクリックすると組織情報が表示され、線は組織間の関係（同盟・対立・派生・分裂）を示しています。
        </p>
      </div>

      <OrganizationMap
        organizations={organizationsWithLocation}
        relationships={relationships}
        relationshipTypes={relationshipTypes}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-2">💡 使い方</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 📍 マーカーをクリックすると組織の詳細情報が表示されます</li>
          <li>• ➖ 線をクリックすると組織間の関係性が表示されます</li>
          <li>• 🔍 マウスホイールでズーム、ドラッグで地図を移動できます</li>
          <li>• 🔴 赤い点線は対立関係を示します</li>
          <li>• 🟢 緑の線は同盟・協力関係を示します</li>
        </ul>
      </div>
    </div>
  )
}
