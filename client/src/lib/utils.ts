import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  
  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  
  return past.toLocaleDateString()
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'running':
    case 'success':
    case 'completed':
      return 'bg-success'
    case 'paused':
    case 'warning':
    case 'scheduled':
      return 'bg-warning'
    case 'failed':
    case 'error':
      return 'bg-destructive'
    default:
      return 'bg-gray-400'
  }
}

export function getStatusTextColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'running':
    case 'success':
    case 'completed':
      return 'text-success'
    case 'paused':
    case 'warning':
    case 'scheduled':
      return 'text-warning'
    case 'failed':
    case 'error':
      return 'text-destructive'
    default:
      return 'text-gray-400'
  }
}
