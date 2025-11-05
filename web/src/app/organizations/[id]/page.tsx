import { notFound } from 'next/navigation'
import organizationsData from '../../../../../data/organizations.json'

export function generateStaticParams() {
  return organizationsData.organizations.map((org) => ({
    id: org.id,
  }))
}

export default function OrganizationPage({ params }: { params: { id: string } }) {
  const org = organizationsData.organizations.find(o => o.id === params.id)

  if (!org) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold mb-2">{org.name.ja}</h1>
        <p className="text-xl text-gray-600 mb-4">{org.name.en}</p>
        <div className="flex gap-2 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            org.status.includes('活動') ? 'bg-red-100 text-red-800' :
            org.status.includes('弱体化') ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
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

      {/* 3行サマリー */}
      <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-3">💡 わかりやすい解説</h2>
        <p className="text-lg leading-relaxed">{org.currentStatus.summary}</p>
      </section>

      {/* 現在の状況 */}
      <section>
        <h2 className="text-2xl font-bold mb-4">📊 現在の状況</h2>
        <div className="space-y-4">
          {org.estimatedMembers && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">推定メンバー数</h3>
              <p className="text-lg">{org.estimatedMembers.current}</p>
              {org.estimatedMembers.peak && (
                <p className="text-sm text-gray-600 mt-1">
                  最盛期: {org.estimatedMembers.peak}
                </p>
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
      <section>
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
      <section>
        <h2 className="text-2xl font-bold mb-4">🗺️ 活動地域</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-2">主な国</h3>
            <div className="flex flex-wrap gap-2">
              {org.primaryCountries.map(country => (
                <span key={country} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {country}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold mb-2">具体的な地域</h3>
            <div className="flex flex-wrap gap-2">
              {org.activeLocations.map(loc => (
                <span key={loc} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {loc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 信頼性評価 */}
      <section className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">🏆 情報の信頼性</h2>
        <div className="space-y-3">
          <div>
            <span className="font-bold">信頼性ランク: </span>
            <span className={`px-3 py-1 rounded ${
              org.credibilityAssessment.sourceTier === 'tier1'
                ? 'bg-green-600 text-white'
                : 'bg-yellow-600 text-white'
            }`}>
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
              {org.credibilityAssessment.reliabilitySources.map(source => (
                <li key={source} className="text-sm text-gray-700">
                  • {source}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 関連組織 */}
      {org.relatedOrganizations && org.relatedOrganizations.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">🔗 関連組織</h2>
          <div className="flex flex-wrap gap-2">
            {org.relatedOrganizations.map(relatedId => {
              const related = organizationsData.organizations.find(o => o.id === relatedId)
              return related ? (
                <a
                  key={relatedId}
                  href={`/organizations/${relatedId}`}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm transition"
                >
                  {related.name.ja}
                </a>
              ) : (
                <span key={relatedId} className="bg-gray-100 px-3 py-2 rounded text-sm">
                  {relatedId}
                </span>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
