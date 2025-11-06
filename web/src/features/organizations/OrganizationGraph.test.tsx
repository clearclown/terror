import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrganizationGraph } from './OrganizationGraph'

describe('OrganizationGraph', () => {
  const mockRelationships = [
    {
      id: 'rel-001',
      from: 'org1',
      to: 'org2',
      type: 'split' as const,
      year: 2000,
      description: 'Test split',
    },
    {
      id: 'rel-002',
      from: 'org2',
      to: 'org3',
      type: 'alliance' as const,
      year: 2010,
      description: 'Test alliance',
    },
  ]

  const mockRelationshipTypes = {
    split: {
      ja: '分派',
      en: 'Split',
      color: '#f59e0b',
      description: 'Split relationship',
    },
    alliance: {
      ja: '提携',
      en: 'Alliance',
      color: '#10b981',
      description: 'Alliance relationship',
    },
  }

  const mockOrganizations = [
    { id: 'org1', name: { ja: '組織1', en: 'Org 1' } },
    { id: 'org2', name: { ja: '組織2', en: 'Org 2' } },
    { id: 'org3', name: { ja: '組織3', en: 'Org 3' } },
  ]

  it('renders without crashing', () => {
    render(
      <OrganizationGraph
        relationships={mockRelationships}
        relationshipTypes={mockRelationshipTypes}
        organizations={mockOrganizations}
      />
    )

    // React Flowがレンダリングされることを確認
    const container = document.querySelector('.react-flow')
    expect(container).toBeTruthy()
  })

  it('renders relationship type legend', () => {
    render(
      <OrganizationGraph
        relationships={mockRelationships}
        relationshipTypes={mockRelationshipTypes}
        organizations={mockOrganizations}
      />
    )

    expect(screen.getByText('関係性の種類')).toBeInTheDocument()
    expect(screen.getByText('分派')).toBeInTheDocument()
    expect(screen.getByText('提携')).toBeInTheDocument()
  })

  it('renders timeline axis', () => {
    render(
      <OrganizationGraph
        relationships={mockRelationships}
        relationshipTypes={mockRelationshipTypes}
        organizations={mockOrganizations}
      />
    )

    // Decadesが表示されることを確認
    expect(screen.getByText('1960s')).toBeInTheDocument()
    expect(screen.getByText('2020s')).toBeInTheDocument()
  })

  it('handles empty relationships gracefully', () => {
    render(
      <OrganizationGraph
        relationships={[]}
        relationshipTypes={mockRelationshipTypes}
        organizations={mockOrganizations}
      />
    )

    // エラーが発生しないことを確認
    const container = document.querySelector('.react-flow')
    expect(container).toBeTruthy()
  })
})
