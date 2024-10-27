import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomElement<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)]
}

export * from './utils/cssVar'
export * from './utils/getConnectionText'
export * from './utils/getRenderContainer'
export * from './utils/isCustomNodeSelected'
export * from './utils/isTextSelected'
