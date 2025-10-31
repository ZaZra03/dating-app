/**
 * Utility functions for styling and class name management.
 * Combines clsx and tailwind-merge for conditional class names with Tailwind CSS conflict resolution.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and resolves Tailwind CSS class conflicts using tailwind-merge.
 * 
 * @param inputs - Variable number of class name arguments (strings, objects, arrays, etc.)
 * @returns Merged class name string with resolved Tailwind conflicts
 * 
 * @example
 * cn("px-2 py-1", "px-4") // Returns "py-1 px-4" (px-4 overrides px-2)
 * cn({ "bg-red": true, "bg-blue": false }) // Returns "bg-red"
 * cn("text-sm", isActive && "text-lg") // Conditionally includes classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
