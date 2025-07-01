import unicodeRanges, { UnicodeRange } from 'unicode-range-json'


export function getUnicodeRanges(): UnicodeRange[] {
    unicodeRanges.splice(-2, 2)
    unicodeRanges.sort((a: UnicodeRange, b: UnicodeRange) => a.category.localeCompare(b.category, 'en'))

    return unicodeRanges
}

export function getUnicodeRangeChars(unicodeRange: UnicodeRange): string {
    let charSet = ""

    for (let i = unicodeRange.range[0]; i < unicodeRange.range[1]; i++) {
        charSet += String.fromCharCode(i)
    }

    return charSet
}
