export const PILLARS = {
  redesign: {
    id: 'redesign',
    label: 'Redesign',
    pluralLabel: 'Redesigns',
    description: 'Before/after visual transformations',
    color: '#f472b6',
    cssVar: 'var(--pillar-redesign)',
  },
  build: {
    id: 'build',
    label: 'Build',
    pluralLabel: 'Builds',
    description: 'Progress on side projects, shipped features',
    color: '#a78bfa',
    cssVar: 'var(--pillar-build)',
  },
  workflow: {
    id: 'workflow',
    label: 'Workflow',
    pluralLabel: 'Workflows',
    description: 'Process posts, frameworks, how-tos',
    color: '#38bdf8',
    cssVar: 'var(--pillar-workflow)',
  },
  insight: {
    id: 'insight',
    label: 'Insight',
    pluralLabel: 'Insights',
    description: 'Genuine learnings, observations, questions',
    color: '#fbbf24',
    cssVar: 'var(--pillar-insight)',
  },
} as const

export type PillarId = keyof typeof PILLARS
export type Pillar = (typeof PILLARS)[PillarId]

export const PILLAR_LIST = Object.values(PILLARS)

export const PILLAR_IDS = Object.keys(PILLARS) as PillarId[]

export function getPillar(id: PillarId): Pillar {
  return PILLARS[id]
}
