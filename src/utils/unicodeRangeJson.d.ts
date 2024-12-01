
declare module 'unicode-range-json' {
    export interface UnicodeRange {
        category: string,
        hexrange: [string, string]
        range: [number, number]
    }

    export = [] as UnicodeRange[]
}
