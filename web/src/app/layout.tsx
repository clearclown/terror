import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '世界安全情報プラットフォーム',
  description: 'テロ組織、武装グループ、PMC等の包括的情報 - 旅行者、研究者、インテリジェンス向け',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                🌍 世界安全情報
              </h1>
              <div className="flex gap-4 text-sm">
                <a href="/" className="hover:underline">ホーム</a>
                <a href="/organizations" className="hover:underline">組織一覧</a>
                <a href="/organizations/relationships" className="hover:underline">関係図</a>
                <a href="/organizations/map" className="hover:underline">🗺️ 世界地図</a>
                <a href="/events" className="hover:underline">事件</a>
                <a href="/countries" className="hover:underline">国別</a>
              </div>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t mt-12 py-6 text-center text-sm text-gray-600">
          <p>世界安全情報プラットフォーム - 人類の安全な移動と理解のために</p>
          <p className="mt-2">教育・研究目的での使用を想定しています</p>
        </footer>
      </body>
    </html>
  )
}
