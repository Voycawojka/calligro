export interface UnicodeRange {
    category: string,
    hexrange: [string, string]
    range: [number, number]
}

export function getUnicodeRanges(): UnicodeRange[] {
    const unicodeRanges: UnicodeRange[] = require('unicode-range-json')
    unicodeRanges.splice(-2, 2)
    unicodeRanges.sort((a: UnicodeRange, b: UnicodeRange) => a.category.localeCompare(b.category, 'en'))

    return unicodeRanges
}
