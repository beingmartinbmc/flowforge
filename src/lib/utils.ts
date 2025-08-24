import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// GitHub Pages routing utility
export function getBasePath(): string {
  // Check if we're in production (GitHub Pages)
  if (typeof window !== 'undefined' && window.location.hostname === 'beingmartinbmc.github.io') {
    return '/flowforge';
  }
  return '';
}

export function getPath(path: string): string {
  return getBasePath() + path;
}
