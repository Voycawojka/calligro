import unicodeRanges, { UnicodeRange } from 'unicode-range-json'


export function getUnicodeRanges(): UnicodeRange[] {
    unicodeRanges.splice(-2, 2)
    unicodeRanges.sort((a: UnicodeRange, b: UnicodeRange) => a.category.localeCompare(b.category, 'en'))

    return unicodeRanges
}
