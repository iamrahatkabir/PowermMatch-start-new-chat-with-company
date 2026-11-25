// Joins class names, skipping false / null / undefined: cx('a', on && 'b') → 'a b'
export const cx = (...parts) => parts.flat(Infinity).filter(Boolean).join(' ')
