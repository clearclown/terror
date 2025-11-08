import Link from 'next/link'
import organizationsData from '@/data/organizations.json'

export default function OrganizationsPage() {
  const orgs = organizationsData.organizations

  // ステータスでグループ化
  const active = orgs.filter(o => o.status.includes('活動'))
  const weakened = orgs.filter(o => o.status.includes('弱体化'))
  const dismantled = orgs.filter(o => o.status.includes('壊滅') || o.status.includes('解散'))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">組織一覧</h1>
        <p className="text-gray-600">
          世界のテロ組織・武装グループの最新情報（2024-2025年）
        </p>
      </div>

      {/* 活動中 */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-red-500">●</span> 活動中の組織
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map(org => (
            <Link
              key={org.id}
              href={`/organizations/${org.id}` as any}
              className="block p-4 border rounded-lg hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg mb-2">{org.name.ja}</h3>
              <p className="text-sm text-gray-600 mb-2">{org.name.en}</p>
              <div className="flex gap-2 mb-2">
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  {org.status}
                </span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {org.region}
                </span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-2">
                {org.currentStatus.summary}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 弱体化 */}
      {weakened.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-yellow-500">●</span> 弱体化した組織
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakened.map(org => (
              <Link
                key={org.id}
                href={`/organizations/${org.id}`}
                className="block p-4 border rounded-lg hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg mb-2">{org.name.ja}</h3>
                <p className="text-sm text-gray-600 mb-2">{org.name.en}</p>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {org.status}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {org.region}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {org.currentStatus.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 壊滅・解散 */}
      {dismantled.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-500">●</span> 壊滅・解散した組織
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dismantled.map(org => (
              <Link
                key={org.id}
                href={`/organizations/${org.id}`}
                className="block p-4 border rounded-lg hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg mb-2">{org.name.ja}</h3>
                <p className="text-sm text-gray-600 mb-2">{org.name.en}</p>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {org.status}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    {org.region}
                  </span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {org.currentStatus.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
