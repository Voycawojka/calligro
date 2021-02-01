export function charToUnicode(char: string): number {
    return char.charCodeAt(0)
}

export function unicodeToChar(unicode: number): string {
    return String.fromCharCode(unicode)
}
 