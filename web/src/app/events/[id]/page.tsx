import { notFound } from 'next/navigation'
import eventsData from '@/data/events.json'
import { EventDetailClient } from './EventDetailClient'

/**
 * 静的パラメータの生成
 * すべてのイベントIDを返して、ビルド時に静的ページを生成します
 */
export function generateStaticParams() {
  return eventsData.events.map((event) => ({
    id: event.id,
  }))
}

/**
 * イベント詳細ページ
 * @param params - URLパラメータ（イベントID）
 */
export default function EventPage({ params }: { params: { id: string } }) {
  // イベントIDに一致するデータを検索
  const event = eventsData.events.find((e) => e.id === params.id)

  // イベントが見つからない場合は404ページを表示
  if (!event) {
    notFound()
  }

  // イベントデータをクライアントコンポーネントに渡す
  return <EventDetailClient event={event as any} />
}
