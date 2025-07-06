import dayjs from 'dayjs';

/**
 * Format an ISO datetime string to the desired format.
 * @param isoString ISO string, e.g. "2025-06-29T11:55:03.298Z"
 * @param formatStr Desired format, e.g. "DD/MM/YYYY HH:mm:ss"
 * @returns Formatted string or empty string if invalid
 */
export function parseDateTime(
  date: Date,
  formatStr: string = 'DD/MM/YYYY HH:mm:ss',
): string {
  const d = dayjs(date);
  if (!d.isValid()) return '';
  return d.format(formatStr);
}
