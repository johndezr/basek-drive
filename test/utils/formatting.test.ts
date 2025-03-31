import { it, expect, describe } from 'vitest';
import { formatCreatedTime, formatFileSize } from '../../src/utils/formatting';

describe('formatting.ts', () => {
  it('should format created time correctly', () => {
    const createdTime = '2023-10-01T12:00:00Z';
    const formattedTime = formatCreatedTime(createdTime);
    const date = new Date(createdTime);
    expect(formattedTime).toBe(date.toLocaleString());
  });

  it('should format file size correctly', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(2048)).toBe('2 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
});
