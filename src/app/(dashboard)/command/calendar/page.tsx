'use client'

import { useState } from 'react'
import { format, startOfWeek, addDays, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const timeSlots = [
  '08:00',
  '09:30',
  '11:00',
  '12:30',
  '14:00',
  '15:30',
  '17:00',
]

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) =>
      addDays(prev, direction === 'prev' ? -7 : 7)
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Calendar</h1>
          <p className="text-sm text-text-secondary">
            Week of {format(weekStart, 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b border-border">
            {/* Time column header */}
            <div className="border-r border-border p-3" />
            {/* Day headers */}
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className={`border-r border-border p-3 text-center last:border-r-0 ${
                  isSameDay(day, new Date())
                    ? 'bg-accent/10'
                    : ''
                }`}
              >
                <p className="text-xs text-text-secondary">
                  {format(day, 'EEE')}
                </p>
                <p
                  className={`text-lg font-medium ${
                    isSameDay(day, new Date())
                      ? 'text-accent'
                      : ''
                  }`}
                >
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 border-b border-border last:border-b-0">
              {/* Time label */}
              <div className="border-r border-border p-3 text-xs text-text-secondary">
                {time}
              </div>
              {/* Day cells */}
              {weekDays.map((day) => (
                <div
                  key={`${day.toISOString()}-${time}`}
                  className={`border-r border-border p-2 last:border-r-0 min-h-[80px] transition-colors hover:bg-surface ${
                    isSameDay(day, new Date()) ? 'bg-accent/5' : ''
                  }`}
                >
                  <button className="w-full h-full flex items-center justify-center text-text-tertiary opacity-0 hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
