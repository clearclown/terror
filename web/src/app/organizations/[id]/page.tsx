import { notFound } from 'next/navigation'
import organizationsData from '@/data/organizations.json'
import relationshipsData from '@/data/relationships.json'
import { OrganizationDetailClient } from './OrganizationDetailClient'

export function generateStaticParams() {
  return organizationsData.organizations.map((org) => ({
    id: org.id,
  }))
}

export default function OrganizationPage({ params }: { params: { id: string } }) {
  const org = organizationsData.organizations.find((o) => o.id === params.id)

  if (!org) {
    notFound()
  }

  // 関連する関係性を取得
  const relevantRelationships = relationshipsData.relationships.filter(
    (rel) => rel.from === params.id || rel.to === params.id
  )

  return (
    <OrganizationDetailClient
      organization={org as any}
      relationships={relevantRelationships}
      allOrganizations={organizationsData.organizations.map((o) => ({
        id: o.id,
        name: o.name,
      }))}
    />
  )
}
