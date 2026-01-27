import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines clsx and tailwind-merge for conditional class names
 * that properly handle Tailwind CSS conflicts.
 *
 * @example
 * cn('px-2 py-1', 'p-4') // Returns 'p-4' (p-4 wins over px-2 py-1)
 * cn('text-red-500', isActive && 'text-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
