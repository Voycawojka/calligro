import { createCanvas } from './canvasHelpers'
import { CodePayload, Slot } from './types'
import { drawInfo, drawSlot } from './slotDrawing'
import { memoize } from '../../utils/decorators'

export default class Template {
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D

    constructor(private readonly slots: Slot[], private readonly base: number) {
        [this.canvas, this.ctx] = createCanvas(this.w * this.slotDim.w, this.h * this.slotDim.h, 'white')
    }

    @memoize
    private get w(): number {
        return Math.ceil(Math.sqrt(this.slots.length + 1))
    }

    @memoize
    private get h(): number {
        return Math.ceil(Math.sqrt(this.slots.length + 1))
    }

    @memoize
    private get slotDim(): { w: number, h: number, hMargin: number } {
        const maxW = Math.max.apply(null, this.slots.map(slot => slot.width))
        const maxH = Math.max.apply(null, this.slots.map(slot => slot.height))

        const slotW = maxW * 1.3
        const slotH = maxH * 1.3
        const vertMargin = (slotH - maxH) / 2

        return { w: slotW, h: slotH, hMargin: vertMargin }
    }

    @memoize
    public generateDataUrl(): string {
        drawInfo(this.ctx, 0, 0, this.slotDim.w, this.slotDim.h)
    
        let currentSlotIdx = 0
    
        slotDrawingLoop:
        for (let slotY = 0; slotY < this.h; slotY ++) {
            for (let slotX = 0; slotX < this.w; slotX ++) {
                if (slotY === 0 && slotX === 0) {
                    continue
                }
    
                const x = slotX * this.slotDim.w
                const y = slotY * this.slotDim.h
                const slot = this.slots[currentSlotIdx]
    
                drawSlot(this.ctx, slot, {
                    x,
                    y,
                    w: this.slotDim.w,
                    h: this.slotDim.h,
                    base: this.base,
                    vertMargin: this.slotDim.hMargin
                })
    
                currentSlotIdx ++
                if (currentSlotIdx >= this.slots.length) {
                    break slotDrawingLoop
                }
            }
        }
    
        return this.canvas.toDataURL()
    }
    
    @memoize
    public generateTemplateCode(): string {
        const payload: CodePayload = {
            version: 0,
            slots: this.slots.map(slot => ([slot.character.charCodeAt(0), slot.width, slot.height])),
            base: this.base
        }

        return btoa(JSON.stringify(payload))
    }
}
