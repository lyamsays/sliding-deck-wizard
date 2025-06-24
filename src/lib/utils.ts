<<<<<<< HEAD
=======

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
>>>>>>> 0586fc0ddfcb662ea18ceb0a567de8e4d6b73122

/**
 * A utility function to combine class names
 */
export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}
