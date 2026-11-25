export type ClassValue = string | false | null | undefined | 0 | ClassValue[]

// Joins class names, skipping false / null / undefined: cx('a', on && 'b') → 'a b'
export const cx = (...parts: ClassValue[]): string => (parts as unknown[]).flat(Infinity).filter(Boolean).join(' ')
