import Link from 'next/link'
import eventsData from '../../../../data/events.json'

export default function EventsPage() {
  const events = eventsData.events.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">事件タイムライン</h1>
        <p className="text-gray-600">
          2001年から2025年までの主要なテロ事件と組織の重要な出来事
        </p>
      </div>

      <div className="space-y-4">
        {events.map(event => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold mb-1">{event.title.ja}</h2>
                <p className="text-gray-600">{event.title.en}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-blue-600">
                  {new Date(event.date).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                {event.type}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {event.location.country}
              </span>
            </div>

            <p className="text-gray-700 mb-3 line-clamp-2">
              {event.description}
            </p>

            {event.casualties && (event.casualties.deaths || event.casualties.injured) && (
              <div className="text-sm text-red-600">
                {event.casualties.deaths && `死者: ${event.casualties.deaths}人`}
                {event.casualties.deaths && event.casualties.injured && ' / '}
                {event.casualties.injured && `負傷者: ${event.casualties.injured}人`}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
