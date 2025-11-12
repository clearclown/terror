import countriesData from '@/data/countries.json'

/**
 * 国のデータ型
 */
export interface Country {
  id: string
  name: {
    ja: string
    en: string
  }
  region: string
  threatLevel: string
  lastUpdated: string
  summary: string
  activeOrganizations?: string[]
  dismantledOrganizations?: string[]
  historicalOrganizations?: string[]
  governingOrganization?: string
  currentSituation?: {
    overview: string
    keyDevelopments?: string[]
    threatAssessment?: string
    casualties?: Record<string, unknown>
    governanceIssues?: string[]
    terrorismConcerns?: string
    humanitarianCrisis?: string | Record<string, unknown>
    [key: string]: unknown
  }
  counterTerrorismEfforts?: string[]
  majorEvents?: Array<{
    year: number
    event: string
  }>
  credibility?: string
  sources?: string[]
  westBank?: Record<string, unknown>
  futureOutlook?: string
  politicalSituation?: Record<string, unknown>
  affectedRegions?: string[]
  regionalImpact?: string
  tactics?: string[]
  kurdhishIssue?: Record<string, unknown>
  regionalContext?: string[]
  regionalActors?: string[]
}

/**
 * 指定されたIDの国データを取得します
 *
 * @param id - 国のID（例: "philippines", "indonesia"）
 * @returns 国のデータ、見つからない場合はundefined
 *
 * @example
 * ```typescript
 * const country = getCountryById('philippines')
 * if (country) {
 *   console.log(country.name.ja) // "フィリピン"
 * }
 * ```
 */
export function getCountryById(id: string): Country | undefined {
  if (!id || id.trim() === '') {
    return undefined
  }

  return countriesData.countries.find((country) => country.id === id) as
    | Country
    | undefined
}

/**
 * すべての国のIDを取得します（generateStaticParams用）
 *
 * @returns 国のIDの配列
 *
 * @example
 * ```typescript
 * export function generateStaticParams() {
 *   return getAllCountryIds()
 * }
 * ```
 */
export function getAllCountryIds(): Array<{ id: string }> {
  return countriesData.countries.map((country) => ({
    id: country.id,
  }))
}
