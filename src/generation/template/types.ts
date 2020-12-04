export type Slot = {
    character: string,
    width: number,
    height: number
}

export type CodePayload = {
    version: number,
    slots: [number, number, number][],
    base: number
}
