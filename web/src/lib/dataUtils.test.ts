import { describe, it, expect } from 'vitest'
import { getCountryById, getAllCountryIds } from './dataUtils'

describe('dataUtils', () => {
  describe('getCountryById', () => {
    it('returns country when valid id is provided', () => {
      const country = getCountryById('philippines')

      expect(country).toBeDefined()
      expect(country?.id).toBe('philippines')
      expect(country?.name.ja).toBe('フィリピン')
      expect(country?.name.en).toBe('Philippines')
    })

    it('returns undefined when invalid id is provided', () => {
      const country = getCountryById('non-existent-country')

      expect(country).toBeUndefined()
    })

    it('returns undefined when empty string is provided', () => {
      const country = getCountryById('')

      expect(country).toBeUndefined()
    })

    it('returns correct country for all valid ids', () => {
      const validIds = [
        'philippines',
        'indonesia',
        'afghanistan',
        'palestine-gaza',
        'lebanon',
        'nigeria',
        'somalia',
        'turkey',
        'syria',
        'iraq',
        'russia',
        'yemen',
      ]

      validIds.forEach((id) => {
        const country = getCountryById(id)
        expect(country).toBeDefined()
        expect(country?.id).toBe(id)
      })
    })

    it('returns country with all required fields', () => {
      const country = getCountryById('philippines')

      expect(country).toBeDefined()
      expect(country?.id).toBeDefined()
      expect(country?.name).toBeDefined()
      expect(country?.name.ja).toBeDefined()
      expect(country?.name.en).toBeDefined()
      expect(country?.region).toBeDefined()
      expect(country?.threatLevel).toBeDefined()
      expect(country?.lastUpdated).toBeDefined()
      expect(country?.summary).toBeDefined()
    })
  })

  describe('getAllCountryIds', () => {
    it('returns array of country ids', () => {
      const ids = getAllCountryIds()

      expect(Array.isArray(ids)).toBe(true)
      expect(ids.length).toBeGreaterThan(0)
    })

    it('returns expected number of countries', () => {
      const ids = getAllCountryIds()

      // countries.jsonには12カ国が含まれている
      expect(ids.length).toBe(12)
    })

    it('returns valid id format for generateStaticParams', () => {
      const ids = getAllCountryIds()

      ids.forEach((item) => {
        expect(item).toHaveProperty('id')
        expect(typeof item.id).toBe('string')
        expect(item.id.length).toBeGreaterThan(0)
      })
    })

    it('includes known country ids', () => {
      const ids = getAllCountryIds()
      const idStrings = ids.map((item) => item.id)

      expect(idStrings).toContain('philippines')
      expect(idStrings).toContain('indonesia')
      expect(idStrings).toContain('afghanistan')
    })

    it('returns unique ids', () => {
      const ids = getAllCountryIds()
      const idStrings = ids.map((item) => item.id)
      const uniqueIds = new Set(idStrings)

      expect(uniqueIds.size).toBe(idStrings.length)
    })
  })
})
