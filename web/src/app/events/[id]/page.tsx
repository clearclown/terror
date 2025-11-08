import { notFound } from 'next/navigation'
import eventsData from '@/data/events.json'
import organizationsData from '@/data/organizations.json'
import { EventDetailClient } from './EventDetailClient'

export function generateStaticParams() {
  return eventsData.events.map((event) => ({
    id: event.id,
  }))
}

export default function EventPage({ params }: { params: { id: string } }) {
  const event = eventsData.events.find((e) => e.id === params.id)

  if (!event) {
    notFound()
  }

  // 関連する組織を取得
  const relatedOrganization = organizationsData.organizations.find(
    (org) => org.id === event.organization
  )

  return (
    <EventDetailClient
      event={event as any}
      relatedOrganization={relatedOrganization ? {
        id: relatedOrganization.id,
        name: relatedOrganization.name,
      } : undefined}
    />
  )
}
