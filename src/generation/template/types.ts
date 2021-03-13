export interface Slot {
    character: string,
    width: number,
    height: number
}

export interface WorkSlot {
    character: string,
    width?: number,
    height?: number 
  }

export interface CodePayload {
    version: number,
    slots: [number, number, number][],
    base: number,
    presetName: string
}
