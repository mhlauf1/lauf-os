export interface TimeSlot {
  index: number
  startTime: string
  endTime: string
  label: string
}

export const TIME_SLOTS: TimeSlot[] = [
  { index: 0, startTime: '06:30', endTime: '08:00', label: '6:30 AM' },
  { index: 1, startTime: '08:00', endTime: '09:30', label: '8:00 AM' },
  { index: 2, startTime: '09:30', endTime: '11:00', label: '9:30 AM' },
  { index: 3, startTime: '11:00', endTime: '12:30', label: '11:00 AM' },
  { index: 4, startTime: '12:30', endTime: '14:00', label: '12:30 PM' },
  { index: 5, startTime: '14:00', endTime: '15:30', label: '2:00 PM' },
  { index: 6, startTime: '15:30', endTime: '17:00', label: '3:30 PM' },
  { index: 7, startTime: '17:00', endTime: '18:30', label: '5:00 PM' },
  { index: 8, startTime: '18:30', endTime: '20:00', label: '6:30 PM' },
  { index: 9, startTime: '20:00', endTime: '21:30', label: '8:00 PM' },
]

export function getSlotByIndex(index: number): TimeSlot | undefined {
  return TIME_SLOTS.find((slot) => slot.index === index)
}

export function getSlotLabel(index: number): string {
  const slot = getSlotByIndex(index)
  return slot?.label ?? `Slot ${index}`
}

export function getSlotTimeRange(index: number): string {
  const slot = getSlotByIndex(index)
  if (!slot) return ''
  return `${slot.label} - ${formatEndTime(slot.endTime)}`
}

function formatEndTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return m === 0 ? `${h12} ${period}` : `${h12}:${m.toString().padStart(2, '0')} ${period}`
}
