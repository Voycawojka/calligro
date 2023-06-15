import unicodeRanges from "unicode-range-json"

export interface UnicodeRange {
    category: string,
    hexrange: [string, string]
    range: [number, number]
}

export function getUnicodeRanges(): UnicodeRange[] {
    unicodeRanges.splice(-2, 2)
    unicodeRanges.sort((a: UnicodeRange, b: UnicodeRange) => a.category.localeCompare(b.category, 'en'))

    return unicodeRanges
}
