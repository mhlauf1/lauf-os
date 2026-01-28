// =============================================================================
// COLLECTION COLORS
// =============================================================================

export interface CollectionColorConfig {
  id: string
  label: string
  color: string
  bgColor: string
  textColor: string
}

export const collectionColors: CollectionColorConfig[] = [
  { id: 'gray', label: 'Gray', color: '#6b7280', bgColor: 'bg-gray-500/10', textColor: 'text-gray-400' },
  { id: 'red', label: 'Red', color: '#ef4444', bgColor: 'bg-red-500/10', textColor: 'text-red-400' },
  { id: 'orange', label: 'Orange', color: '#f97316', bgColor: 'bg-orange-500/10', textColor: 'text-orange-400' },
  { id: 'amber', label: 'Amber', color: '#f59e0b', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400' },
  { id: 'yellow', label: 'Yellow', color: '#eab308', bgColor: 'bg-yellow-500/10', textColor: 'text-yellow-400' },
  { id: 'lime', label: 'Lime', color: '#84cc16', bgColor: 'bg-lime-500/10', textColor: 'text-lime-400' },
  { id: 'green', label: 'Green', color: '#22c55e', bgColor: 'bg-green-500/10', textColor: 'text-green-400' },
  { id: 'emerald', label: 'Emerald', color: '#10b981', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400' },
  { id: 'teal', label: 'Teal', color: '#14b8a6', bgColor: 'bg-teal-500/10', textColor: 'text-teal-400' },
  { id: 'cyan', label: 'Cyan', color: '#06b6d4', bgColor: 'bg-cyan-500/10', textColor: 'text-cyan-400' },
  { id: 'sky', label: 'Sky', color: '#0ea5e9', bgColor: 'bg-sky-500/10', textColor: 'text-sky-400' },
  { id: 'blue', label: 'Blue', color: '#3b82f6', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400' },
  { id: 'indigo', label: 'Indigo', color: '#6366f1', bgColor: 'bg-indigo-500/10', textColor: 'text-indigo-400' },
  { id: 'violet', label: 'Violet', color: '#8b5cf6', bgColor: 'bg-violet-500/10', textColor: 'text-violet-400' },
  { id: 'purple', label: 'Purple', color: '#a855f7', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400' },
  { id: 'fuchsia', label: 'Fuchsia', color: '#d946ef', bgColor: 'bg-fuchsia-500/10', textColor: 'text-fuchsia-400' },
  { id: 'pink', label: 'Pink', color: '#ec4899', bgColor: 'bg-pink-500/10', textColor: 'text-pink-400' },
  { id: 'rose', label: 'Rose', color: '#f43f5e', bgColor: 'bg-rose-500/10', textColor: 'text-rose-400' },
]

export function getCollectionColorConfig(color: string | null | undefined): CollectionColorConfig {
  if (!color) return collectionColors[0] // Default to gray
  const config = collectionColors.find((c) => c.color === color)
  return config || collectionColors[0]
}

// =============================================================================
// COLLECTION ICONS
// =============================================================================

export interface CollectionIconConfig {
  id: string
  label: string
}

export const collectionIcons: CollectionIconConfig[] = [
  { id: 'Folder', label: 'Folder' },
  { id: 'FolderOpen', label: 'Folder Open' },
  { id: 'Star', label: 'Star' },
  { id: 'Heart', label: 'Heart' },
  { id: 'Bookmark', label: 'Bookmark' },
  { id: 'Flag', label: 'Flag' },
  { id: 'Tag', label: 'Tag' },
  { id: 'Archive', label: 'Archive' },
  { id: 'Box', label: 'Box' },
  { id: 'Package', label: 'Package' },
  { id: 'Layers', label: 'Layers' },
  { id: 'Grid', label: 'Grid' },
  { id: 'Layout', label: 'Layout' },
  { id: 'Palette', label: 'Palette' },
  { id: 'Paintbrush', label: 'Paintbrush' },
  { id: 'Wand2', label: 'Wand' },
  { id: 'Sparkles', label: 'Sparkles' },
  { id: 'Lightbulb', label: 'Lightbulb' },
  { id: 'Zap', label: 'Zap' },
  { id: 'Rocket', label: 'Rocket' },
  { id: 'Code2', label: 'Code' },
  { id: 'Component', label: 'Component' },
  { id: 'FileCode', label: 'File Code' },
  { id: 'Image', label: 'Image' },
  { id: 'Video', label: 'Video' },
  { id: 'Music', label: 'Music' },
  { id: 'Globe', label: 'Globe' },
  { id: 'Building', label: 'Building' },
  { id: 'Users', label: 'Users' },
  { id: 'Trophy', label: 'Trophy' },
]

export function getCollectionIconConfig(icon: string | null | undefined): CollectionIconConfig {
  if (!icon) return collectionIcons[0] // Default to Folder
  const config = collectionIcons.find((i) => i.id === icon)
  return config || collectionIcons[0]
}
