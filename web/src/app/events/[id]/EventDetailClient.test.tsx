import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EventDetailClient } from './EventDetailClient'
import eventsData from '@/data/events.json'

/**
 * イベント詳細コンポーネントのテストスイート
 */
describe('EventDetailClient', () => {
  /**
   * 基本的なイベント情報が正しく表示されることをテスト
   */
  it('正しくイベント情報をレンダリングする', () => {
    const event = eventsData.events[0] // event-001 (9/11)

    render(<EventDetailClient event={event as any} />)

    // タイトルの表示確認
    expect(screen.getByText(event.title.ja)).toBeInTheDocument()
    expect(screen.getByText(event.title.en)).toBeInTheDocument()

    // 説明文の表示確認
    expect(screen.getByText(event.description)).toBeInTheDocument()

    // イベントタイプの表示確認
    expect(screen.getByText(event.type)).toBeInTheDocument()
  })

  /**
   * 日付が正しくフォーマットされて表示されることをテスト
   */
  it('日付を正しくフォーマットして表示する', () => {
    const event = eventsData.events[0] // 2001-09-11

    render(<EventDetailClient event={event as any} />)

    // 日付の表示確認（YYYY-MM-DDから日本語形式へ）
    expect(screen.getByText(/2001年/)).toBeInTheDocument()
  })

  /**
   * 被害者数が正しく表示されることをテスト
   */
  it('被害者数を正しく表示する', () => {
    const event = eventsData.events[0] // deaths: 2977, injured: 6000

    render(<EventDetailClient event={event as any} />)

    // 死者数の表示確認
    expect(screen.getByText(/2977/)).toBeInTheDocument()
    // 負傷者数の表示確認
    expect(screen.getByText(/6000/)).toBeInTheDocument()
  })

  /**
   * 場所情報が正しく表示されることをテスト
   */
  it('場所情報を正しく表示する', () => {
    const event = eventsData.events[0] // country: "米国"

    render(<EventDetailClient event={event as any} />)

    // 国名の表示確認
    expect(screen.getByText(event.location.country)).toBeInTheDocument()
  })

  /**
   * 影響（aftermath）が正しく表示されることをテスト
   */
  it('影響（aftermath）を正しく表示する', () => {
    const event = eventsData.events[0]

    render(<EventDetailClient event={event as any} />)

    // 最初のaftermathアイテムの表示確認
    if (event.aftermath && event.aftermath.length > 0) {
      expect(screen.getByText(event.aftermath[0])).toBeInTheDocument()
    }
  })

  /**
   * 信頼性評価が正しく表示されることをテスト
   */
  it('信頼性評価を正しく表示する', () => {
    const event = eventsData.events[0] // credibility: "tier1"

    render(<EventDetailClient event={event as any} />)

    // tier1の場合「最高」と表示
    expect(screen.getByText('最高')).toBeInTheDocument()
  })

  /**
   * データの一部が欠落している場合にクラッシュしないことをテスト
   */
  it('description が null の場合にクラッシュしない', () => {
    const event = {
      ...eventsData.events[0],
      description: undefined as any,
    }

    expect(() => {
      render(<EventDetailClient event={event as any} />)
    }).not.toThrow()

    // フォールバックテキストが表示されることを確認
    expect(screen.getByText('情報なし')).toBeInTheDocument()
  })

  /**
   * casualties が存在しない場合にクラッシュしないことをテスト
   */
  it('casualties が存在しない場合にクラッシュしない', () => {
    const event = {
      ...eventsData.events[0],
      casualties: undefined as any,
    }

    expect(() => {
      render(<EventDetailClient event={event as any} />)
    }).not.toThrow()
  })

  /**
   * aftermath が存在しない場合にクラッシュしないことをテスト
   */
  it('aftermath が存在しない場合にクラッシュしない', () => {
    const event = {
      ...eventsData.events[0],
      aftermath: undefined as any,
    }

    expect(() => {
      render(<EventDetailClient event={event as any} />)
    }).not.toThrow()
  })

  /**
   * 関連組織へのリンクが正しく表示されることをテスト
   */
  it('関連組織へのリンクを表示する', () => {
    const event = eventsData.events[0] // organization: "al-qaeda"

    render(<EventDetailClient event={event as any} />)

    // 組織詳細ページへのリンクが存在することを確認
    const link = screen.getByRole('link', { name: /組織の詳細/i })
    expect(link).toHaveAttribute('href', `/organizations/${event.organization}`)
  })

  /**
   * tier2 の信頼性評価が正しく表示されることをテスト
   */
  it('tier2 の信頼性評価を正しく表示する', () => {
    const event = eventsData.events.find(e => e.credibility === 'tier2')

    if (event) {
      render(<EventDetailClient event={event as any} />)

      // tier2の場合「高」と表示
      expect(screen.getByText('高')).toBeInTheDocument()
    }
  })
})

/**
 * データ取得ロジックのテストスイート
 */
describe('Event data fetching', () => {
  /**
   * 特定のIDでイベントデータを取得できることをテスト
   */
  it('events.json から特定のIDでデータを取得できる', () => {
    const event = eventsData.events.find(e => e.id === 'event-001')

    expect(event).toBeDefined()
    expect(event?.id).toBe('event-001')
    expect(event?.title.ja).toBe('米国同時多発テロ事件')
  })

  /**
   * 存在しないIDで undefined が返ることをテスト
   */
  it('存在しないIDで undefined が返る', () => {
    const event = eventsData.events.find(e => e.id === 'non-existent-id')

    expect(event).toBeUndefined()
  })

  /**
   * すべてのイベントがユニークなIDを持つことをテスト
   */
  it('すべてのイベントがユニークなIDを持つ', () => {
    const ids = eventsData.events.map(e => e.id)
    const uniqueIds = new Set(ids)

    expect(ids.length).toBe(uniqueIds.size)
  })
})
