import { Message } from '@/types';

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Convert query results to CSV format
 */
export function convertToCSV(message: Message): string {
  if (!message.results || !message.columns) return '';
  
  const csvHeader = message.columns.join(',');
  const csvRows = message.results.map(row => 
    message.columns!.map(col => {
      const value = row[col];
      // Escape values that contain commas or quotes
      if (value && typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',')
  );
  
  return [csvHeader, ...csvRows].join('\n');
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}
