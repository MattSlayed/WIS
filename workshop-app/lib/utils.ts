/**
 * Utility Functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format datetime to readable string
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Format currency (South African Rand)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    token += chars[array[i] % chars.length];
  }
  return token;
}

/**
 * Calculate expiry date
 */
export function calculateExpiry(hours: number): Date {
  const now = new Date();
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
}

/**
 * Check if a date has expired
 */
export function isExpired(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Sleep for a number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Convert file to base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Download a file
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    received: 'bg-blue-100 text-blue-800',
    logged: 'bg-blue-100 text-blue-800',
    stripped: 'bg-purple-100 text-purple-800',
    assessed: 'bg-purple-100 text-purple-800',
    awaiting_quote_approval: 'bg-yellow-100 text-yellow-800',
    po_received: 'bg-green-100 text-green-800',
    in_repair: 'bg-orange-100 text-orange-800',
    assembled: 'bg-indigo-100 text-indigo-800',
    tested: 'bg-indigo-100 text-indigo-800',
    qc_passed: 'bg-emerald-100 text-emerald-800',
    ready_for_dispatch: 'bg-teal-100 text-teal-800',
    dispatched: 'bg-gray-100 text-gray-800',
    on_hold: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Format status text
 */
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
