import { notFound } from 'next/navigation'
import { getCountryById, getAllCountryIds } from '@/lib/dataUtils'
import { CountryDetailClient } from './CountryDetailClient'

/**
 * 静的パスパラメータを生成します（SSG用）
 *
 * @returns すべての国のIDの配列
 */
export function generateStaticParams() {
  return getAllCountryIds()
}

/**
 * 国詳細ページのメタデータを生成します
 *
 * @param params - ルートパラメータ
 * @returns ページのメタデータ
 */
export async function generateMetadata({ params }: { params: { id: string } }) {
  const country = getCountryById(params.id)

  if (!country) {
    return {
      title: '国が見つかりません',
    }
  }

  return {
    title: `${country.name.ja} - テロリズム影響国情報`,
    description: country.summary,
  }
}

/**
 * 国詳細ページコンポーネント
 *
 * @param params - ルートパラメータ
 * @returns 国詳細ページ
 */
export default function CountryPage({ params }: { params: { id: string } }) {
  const country = getCountryById(params.id)

  if (!country) {
    notFound()
  }

  return <CountryDetailClient country={country} />
}
