import type { LibraryItemType, LibraryItemStatus } from '@prisma/client'

// =============================================================================
// LIBRARY ITEM TYPE CONFIG
// =============================================================================

export interface LibraryTypeConfig {
  id: LibraryItemType
  label: string
  pluralLabel: string
  color: string
  bgColor: string
  textColor: string
  icon: string
  description: string
}

export const libraryTypeConfig: Record<LibraryItemType, LibraryTypeConfig> = {
  DESIGN: {
    id: 'DESIGN',
    label: 'Design',
    pluralLabel: 'Designs',
    color: '#8b5cf6',
    bgColor: 'bg-violet-500/10',
    textColor: 'text-violet-400',
    icon: 'Palette',
    description: 'Screenshots, videos, Figma files, visual references',
  },
  DEVELOPED: {
    id: 'DEVELOPED',
    label: 'Developed',
    pluralLabel: 'Developed',
    color: '#3b82f6',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    icon: 'Code2',
    description: 'Components, sections, pages, templates, websites - built code',
  },
}

export const libraryTypeList = Object.values(libraryTypeConfig)

export function getLibraryTypeConfig(type: LibraryItemType | string): LibraryTypeConfig {
  // Handle old/unknown types by defaulting to DESIGN
  return libraryTypeConfig[type as LibraryItemType] || libraryTypeConfig.DESIGN
}

// =============================================================================
// LIBRARY ITEM STATUS CONFIG
// =============================================================================

export interface LibraryStatusConfig {
  id: LibraryItemStatus
  label: string
  color: string
  bgColor: string
  textColor: string
  icon: string
  description: string
}

export const libraryStatusConfig: Record<LibraryItemStatus, LibraryStatusConfig> = {
  ACTIVE: {
    id: 'ACTIVE',
    label: 'Active',
    color: '#22c55e',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    icon: 'CheckCircle',
    description: 'Current, visible items',
  },
  ARCHIVED: {
    id: 'ARCHIVED',
    label: 'Archived',
    color: '#6b7280',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400',
    icon: 'Archive',
    description: 'Hidden from main view',
  },
}

export const libraryStatusList = Object.values(libraryStatusConfig)

export function getLibraryStatusConfig(status: LibraryItemStatus | string): LibraryStatusConfig {
  // Handle old/unknown statuses by defaulting to ACTIVE
  return libraryStatusConfig[status as LibraryItemStatus] || libraryStatusConfig.ACTIVE
}

// =============================================================================
// CODE LANGUAGE CONFIG
// =============================================================================

export interface CodeLanguageConfig {
  id: string
  label: string
  extension: string
}

export const codeLanguageConfig: Record<string, CodeLanguageConfig> = {
  tsx: { id: 'tsx', label: 'TypeScript React', extension: '.tsx' },
  jsx: { id: 'jsx', label: 'JavaScript React', extension: '.jsx' },
  typescript: { id: 'typescript', label: 'TypeScript', extension: '.ts' },
  javascript: { id: 'javascript', label: 'JavaScript', extension: '.js' },
  css: { id: 'css', label: 'CSS', extension: '.css' },
  scss: { id: 'scss', label: 'SCSS', extension: '.scss' },
  html: { id: 'html', label: 'HTML', extension: '.html' },
  json: { id: 'json', label: 'JSON', extension: '.json' },
  markdown: { id: 'markdown', label: 'Markdown', extension: '.md' },
  python: { id: 'python', label: 'Python', extension: '.py' },
  other: { id: 'other', label: 'Other', extension: '' },
}

export const codeLanguageList = Object.values(codeLanguageConfig)

export function getCodeLanguageConfig(language: string): CodeLanguageConfig {
  return codeLanguageConfig[language] || codeLanguageConfig.other
}
