import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          世界安全情報プラットフォーム
        </h1>
        <p className="text-xl text-gray-700 mb-6">
          テロ組織・武装グループ・PMCの包括的情報
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          民間旅行者、研究者、インテリジェンス関係者、ジャーナリスト、企業向けの
          わかりやすい安全情報プラットフォーム
        </p>
      </section>

      {/* Target Users */}
      <section>
        <h2 className="text-2xl font-bold mb-4">対象ユーザー</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-3xl mb-2">🧳</div>
            <h3 className="font-bold mb-2">民間旅行者</h3>
            <p className="text-sm text-gray-600">
              渡航前の安全確認に
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-3xl mb-2">🎓</div>
            <h3 className="font-bold mb-2">研究者・学生</h3>
            <p className="text-sm text-gray-600">
              学術研究と歴史理解に
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="font-bold mb-2">インテリジェンス</h3>
            <p className="text-sm text-gray-600">
              専門的分析と情報収集に
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-3xl mb-2">📰</div>
            <h3 className="font-bold mb-2">ジャーナリスト</h3>
            <p className="text-sm text-gray-600">
              取材前調査に
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-3xl mb-2">🏢</div>
            <h3 className="font-bold mb-2">企業</h3>
            <p className="text-sm text-gray-600">
              海外駐在員の安全管理に
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-3xl mb-2">🌐</div>
            <h3 className="font-bold mb-2">一般市民</h3>
            <p className="text-sm text-gray-600">
              世界情勢の理解に
            </p>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section>
        <h2 className="text-2xl font-bold mb-4">対象範囲</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-bold mb-2">🔴 テロ組織</h3>
            <p className="text-sm text-gray-700">
              政府指定・非指定問わず、実際に脅威となっている組織
            </p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-bold mb-2">🟠 武装グループ</h3>
            <p className="text-sm text-gray-700">
              ミリシア、民兵組織、反政府武装勢力
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold mb-2">🟡 民間軍事会社</h3>
            <p className="text-sm text-gray-700">
              PMC、セキュリティ企業
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold mb-2">🔵 駐在軍・外国軍</h3>
            <p className="text-sm text-gray-700">
              紛争地域の外国軍、クーデタ勢力
            </p>
          </div>
        </div>
      </section>

      {/* Regional Trends */}
      <section>
        <h2 className="text-2xl font-bold mb-4">地域別トレンド（2025年）</h2>
        <div className="space-y-3">
          <div className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold">🟢 東南アジア</span>
              <span className="ml-4 text-gray-600">大幅改善</span>
            </div>
            <div className="text-sm text-gray-600">
              ASG壊滅、JI解散
            </div>
          </div>
          <div className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold">🔴 アフリカ</span>
              <span className="ml-4 text-gray-600">悪化</span>
            </div>
            <div className="text-sm text-gray-600">
              ボコ・ハラム、アル・シャバブ激化
            </div>
          </div>
          <div className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold">🟡 中東</span>
              <span className="ml-4 text-gray-600">混在</span>
            </div>
            <div className="text-sm text-gray-600">
              ガザ戦争、PKK和平、ISIS激化
            </div>
          </div>
          <div className="p-4 border rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold">🔴 南アジア</span>
              <span className="ml-4 text-gray-600">高リスク</span>
            </div>
            <div className="text-sm text-gray-600">
              タリバン統治、IS-K活発化
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-8">
        <Link
          href="/organizations"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          組織情報を見る
        </Link>
      </section>

      {/* Disclaimer */}
      <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
        <h3 className="font-bold mb-2">⚠️ 使用上の注意</h3>
        <ul className="space-y-1 text-gray-700">
          <li>• このプラットフォームは教育・研究・安全情報提供を目的としています</li>
          <li>• 情報は複数の信頼できる情報源から収集していますが、不確実性が残る場合があります</li>
          <li>• 渡航前は必ず外務省などの公式情報も確認してください</li>
          <li>• 特定の政治的立場を支持するものではありません</li>
        </ul>
      </section>
    </div>
  )
}
