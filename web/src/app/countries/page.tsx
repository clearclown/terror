import Link from 'next/link'
import countriesData from '../../../../data/countries.json'

export default function CountriesPage() {
  const countries = countriesData.countries

  // 脅威レベルでソート
  const threatOrder = ['非常に高い', '高', '中', '低']
  const sortedCountries = [...countries].sort((a, b) => {
    const aIndex = threatOrder.findIndex(t => a.threatLevel.includes(t))
    const bIndex = threatOrder.findIndex(t => b.threatLevel.includes(t))
    return aIndex - bIndex
  })

  const getThreatColor = (level: string) => {
    if (level.includes('非常に高い')) return 'bg-red-600 text-white'
    if (level.includes('高')) return 'bg-red-500 text-white'
    if (level.includes('中')) return 'bg-yellow-500 text-white'
    return 'bg-green-500 text-white'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">国別情報</h1>
        <p className="text-gray-600">
          テロリズムの影響を受けている国々の現状（{countriesData.statistics.totalCountries}カ国）
        </p>
      </div>

      {/* 地域別サマリー */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">🌍 地域別トレンド</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(countriesData.regionalSummary).map(([region, data]: [string, any]) => (
            <div key={region} className="p-3 bg-white rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{getRegionName(region)}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  data.trend.includes('改善') ? 'bg-green-100 text-green-800' :
                  data.trend.includes('悪化') ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.trend}
                </span>
              </div>
              <p className="text-sm text-gray-600">{data.keyDevelopments}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 国リスト */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCountries.map(country => (
          <Link
            key={country.id}
            href={`/countries/${country.id}`}
            className="block p-4 border rounded-lg hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-lg">{country.name.ja}</h3>
              <span className={`text-xs px-2 py-1 rounded ${getThreatColor(country.threatLevel)}`}>
                {country.threatLevel}
              </span>
            </div>

            <div className="mb-2">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {country.region}
              </span>
            </div>

            <p className="text-sm text-gray-700 line-clamp-3">
              {country.summary}
            </p>

            <div className="mt-3 pt-3 border-t text-xs text-gray-500">
              最終更新: {country.lastUpdated}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function getRegionName(key: string): string {
  const names: Record<string, string> = {
    eastAsia: '東南アジア',
    middleEast: '中東',
    africa: 'アフリカ',
    southAsia: '南アジア',
    centralAsia: '中央アジア'
  }
  return names[key] || key
}
