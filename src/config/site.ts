export const siteConfig = {
  name: 'LAUF OS',
  description: 'Personal Operating System - Command center for life, work, and growth',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Default time block duration (minutes)
  defaultTimeBlockMinutes: 90,

  // Default work hours
  workHours: {
    start: '08:00',
    end: '18:00',
  },

  // Links
  links: {
    x: 'https://x.com/your_handle',
    github: 'https://github.com/your_username',
  },
} as const
