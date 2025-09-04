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
  // If we're already on the GitHub Pages domain, don't add the base path
  // This prevents double /flowforge/flowforge issues
  if (typeof window !== 'undefined' && window.location.hostname === 'beingmartinbmc.github.io') {
    return path;
  }
  
  return getBasePath() + path;
}
