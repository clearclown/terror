import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CountryDetailClient } from './CountryDetailClient'

describe('CountryDetailClient', () => {
  const mockCountry = {
    id: 'test-country',
    name: {
      ja: 'テスト国',
      en: 'Test Country',
    },
    region: '東南アジア',
    threatLevel: '中',
    lastUpdated: '2025-01',
    summary: 'これはテスト国の概要です。',
    activeOrganizations: ['org1', 'org2'],
    currentSituation: {
      overview: '現在の状況の概要',
      keyDevelopments: [
        '2025年: 重要な進展1',
        '2024年: 重要な進展2',
      ],
      threatAssessment: '脅威評価の内容',
    },
    counterTerrorismEfforts: [
      '対テロ対策1',
      '対テロ対策2',
    ],
    majorEvents: [
      {
        year: 2020,
        event: '主要事件1',
      },
      {
        year: 2021,
        event: '主要事件2',
      },
    ],
    credibility: 'tier1',
    sources: ['Source 1', 'Source 2'],
  }

  it('renders country name correctly', () => {
    render(<CountryDetailClient country={mockCountry} />)

    expect(screen.getByText('テスト国')).toBeInTheDocument()
    expect(screen.getByText('Test Country')).toBeInTheDocument()
  })

  it('displays threat level badge', () => {
    render(<CountryDetailClient country={mockCountry} />)

    expect(screen.getByText('中')).toBeInTheDocument()
  })

  it('displays region information', () => {
    render(<CountryDetailClient country={mockCountry} />)

    expect(screen.getByText('東南アジア')).toBeInTheDocument()
  })

  it('displays summary section', () => {
    render(<CountryDetailClient country={mockCountry} />)

    expect(screen.getByText('これはテスト国の概要です。')).toBeInTheDocument()
  })

  it('displays current situation', () => {
    render(<CountryDetailClient country={mockCountry} />)

    expect(screen.getByText('現在の状況の概要')).toBeInTheDocument()
    expect(screen.getByText(/2025年: 重要な進展1/)).toBeInTheDocument()
    expect(screen.getByText(/2024年: 重要な進展2/)).toBeInTheDocument()
  })

  it('displays counter-terrorism efforts', () => {
    render(<CountryDetailClient country={mockCountry} />)

    expect(screen.getByText(/対テロ対策1/)).toBeInTheDocument()
    expect(screen.getByText(/対テロ対策2/)).toBeInTheDocument()
  })

  it('displays major events timeline', () => {
    render(<CountryDetailClient country={mockCountry} />)

    expect(screen.getByText(/2020/)).toBeInTheDocument()
    expect(screen.getByText(/主要事件1/)).toBeInTheDocument()
    expect(screen.getByText(/2021/)).toBeInTheDocument()
    expect(screen.getByText(/主要事件2/)).toBeInTheDocument()
  })

  it('displays credibility information', () => {
    render(<CountryDetailClient country={mockCountry} />)

    expect(screen.getByText(/Source 1/)).toBeInTheDocument()
    expect(screen.getByText(/Source 2/)).toBeInTheDocument()
  })

  // エッジケースのテスト
  describe('edge cases', () => {
    it('handles missing counter-terrorism efforts gracefully', () => {
      const countryWithoutEfforts = {
        ...mockCountry,
        counterTerrorismEfforts: undefined,
      }

      render(<CountryDetailClient country={countryWithoutEfforts} />)

      // コンポーネントがクラッシュせずレンダリングされること
      expect(screen.getByText('テスト国')).toBeInTheDocument()
    })

    it('handles empty active organizations', () => {
      const countryWithoutOrgs = {
        ...mockCountry,
        activeOrganizations: [],
      }

      render(<CountryDetailClient country={countryWithoutOrgs} />)

      expect(screen.getByText('テスト国')).toBeInTheDocument()
    })

    it('handles missing current situation fields', () => {
      const countryWithMinimalData = {
        ...mockCountry,
        currentSituation: {
          overview: '概要のみ',
        },
      }

      render(<CountryDetailClient country={countryWithMinimalData} />)

      expect(screen.getByText('概要のみ')).toBeInTheDocument()
    })

    it('handles empty major events array', () => {
      const countryWithoutEvents = {
        ...mockCountry,
        majorEvents: [],
      }

      render(<CountryDetailClient country={countryWithoutEvents} />)

      expect(screen.getByText('テスト国')).toBeInTheDocument()
    })
  })
})
