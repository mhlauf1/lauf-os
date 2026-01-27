export default function CalendarPage() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const timeSlots = [
    { label: 'Morning', time: '9 AM' },
    { label: 'Afternoon', time: '2 PM' },
    { label: 'Evening', time: '7 PM' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-border px-3 py-1 text-sm text-text-secondary hover:bg-surface">
            &larr; Prev
          </button>
          <span className="text-sm text-text-secondary">This Week</span>
          <button className="rounded-lg border border-border px-3 py-1 text-sm text-text-secondary hover:bg-surface">
            Next &rarr;
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Header */}
        <div className="grid grid-cols-6 border-b border-border bg-surface">
          <div className="p-3" />
          {days.map((day) => (
            <div
              key={day}
              className="border-l border-border p-3 text-center text-sm font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        {timeSlots.map((slot) => (
          <div
            key={slot.label}
            className="grid grid-cols-6 border-b border-border last:border-b-0"
          >
            <div className="p-3">
              <span className="text-sm text-text-secondary">{slot.label}</span>
              <span className="block text-xs text-text-tertiary">
                {slot.time}
              </span>
            </div>
            {days.map((day) => (
              <div
                key={`${day}-${slot.time}`}
                className="min-h-[80px] border-l border-border p-2 hover:bg-surface-elevated"
              >
                {/* Scheduled posts would render here */}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Ready to schedule */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium">Ready to Schedule</h2>
        <p className="text-text-secondary">
          No ideas ready to schedule. Drag ideas here to schedule them.
        </p>
      </section>
    </div>
  )
}
