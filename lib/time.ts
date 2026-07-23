const ARGENTINA_TIME_ZONE = 'America/Argentina/Buenos_Aires'

/** Formats local Argentina time as "03:45 PM". */
export function formatArgentinaTime(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: ARGENTINA_TIME_ZONE,
  }).formatToParts(date)

  const hour = parts.find((part) => part.type === 'hour')?.value ?? '00'
  const minute = parts.find((part) => part.type === 'minute')?.value ?? '00'
  const dayPeriod = parts.find((part) => part.type === 'dayPeriod')?.value ?? 'AM'

  return `${hour.padStart(2, '0')}:${minute} ${dayPeriod.toUpperCase()}`
}
