import { convertToBlob, createCanvas } from '../../utils/canvasHelpers'
import { CodePayload, Slot } from './types'
import { drawInfo, drawSlot } from './slotDrawing'
import { memoize } from '../../utils/decorators'

export default class Template {
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D

    constructor(private readonly slots: Slot[], private readonly base: number, private readonly presetName: string) {
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
    public get slotDim(): { w: number, h: number, hMargin: number } {
        const maxW = Math.max.apply(null, this.slots.map(slot => slot.width))
        const maxH = Math.max.apply(null, this.slots.map(slot => slot.height))

        const slotW = maxW * 1.3
        const slotH = maxH * 1.3
        const vertMargin = (slotH - maxH) / 2

        return { w: slotW, h: slotH, hMargin: vertMargin }
    }

    public getSlotPosition(index: number): { x: number, y: number } {
        return {
            x: (index % this.w) * this.slotDim.w,
            y: Math.floor(index / this.w) * this.slotDim.h
        }
    }

    @memoize
    public generateImageBlob(): Promise<Blob> {
        drawInfo(this.ctx, 0, 0, this.slotDim.w, this.slotDim.h)
    
        this.slots.forEach((slot, index) => {
            const { x, y } = this.getSlotPosition(index + 1)

            drawSlot(this.ctx, slot, {
                x,
                y,
                w: this.slotDim.w,
                h: this.slotDim.h,
                base: this.base,
                vertMargin: this.slotDim.hMargin
            })
        })

        return convertToBlob(this.canvas)
    }
    
    @memoize
    public generateTemplateCode(): string {
        const payload: CodePayload = {
            version: 1,
            slots: this.slots.map(slot => ([slot.character.charCodeAt(0), slot.width, slot.height])),
            base: this.base,
            presetName: this.presetName
        }

        return btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
    }
}
