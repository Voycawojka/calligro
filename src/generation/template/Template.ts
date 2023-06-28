import { convertToBlob, createCanvas } from '../../utils/canvasHelpers'
import { CodePayload, Slot } from './types'
import { drawLogo, drawSlot } from './slotDrawing'
import { isElectron } from '../../electron/electronInterop'

export interface FontOptions {
    name: string
    fillColor: string
    outlineColor: string
}

export interface EnclosingSpaceDimensions {
    w: number
    h: number
    hMargin: number
}

export default class Template {
    private readonly canvas: HTMLCanvasElement
    private readonly ctx: CanvasRenderingContext2D

    private cachedBlob: Blob | null = null
    private cachedCode: string | null = null

    public readonly w: number
    public readonly h: number
    public readonly enclosingDim: EnclosingSpaceDimensions

    constructor(
        private readonly slots: Slot[],
        private readonly base: number,
        private readonly presetName: string,
        private readonly fontOptions: FontOptions | null
    ) {
        this.w = Math.ceil(Math.sqrt(this.slots.length + 1))
        this.h = Math.ceil(Math.sqrt(this.slots.length + 1))
        this.enclosingDim = this.calcEnclosingDim(this.slots)

        ;[this.canvas, this.ctx] = createCanvas(this.w * this.enclosingDim.w, this.h * this.enclosingDim.h, '#202020')
    }

    private calcEnclosingDim(slots: Slot[]): EnclosingSpaceDimensions {
        const maxW = Math.max.apply(null, slots.map(slot => slot.width))
        const maxH = Math.max.apply(null, slots.map(slot => slot.height))

        const slotW = Math.round(maxW * 1.3)
        const slotH = Math.max(Math.round(maxH * 1.3), 30)
        const vertMargin = Math.ceil((slotH - maxH) / 2)

        return { w: slotW, h: slotH, hMargin: vertMargin }
    }

    public getSlotPosition(index: number): { x: number, y: number } {
        return {
            x: (index % this.w) * this.enclosingDim.w,
            y: Math.floor(index / this.w) * this.enclosingDim.h
        }
    }

    public async generateImageBlob(): Promise<Blob> {
        if (!this.cachedBlob) {
            if (!isElectron()) {
                // hotfix (it should work with electron too)
                await drawLogo(this.ctx, 0, 0, this.enclosingDim.w, this.enclosingDim.h)
            }
        
            this.slots.forEach((slot, index) => {
                const { x, y } = this.getSlotPosition(index + 1)

                drawSlot(this.ctx, slot, {
                    enclosingSpaceX: x,
                    enclosingSpaceY: y,
                    enclosingSpaceW: this.enclosingDim.w,
                    enclosingSpaceH: this.enclosingDim.h,
                    base: this.base,
                    vertMargin: this.enclosingDim.hMargin,
                    font: this.fontOptions
                })
            })

            this.cachedBlob = await convertToBlob(this.canvas)
        }

        return this.cachedBlob
    }
    
    public generateTemplateCode(): string {
        if (!this.cachedCode) {
            const payload: CodePayload = {
                version: 2,
                slots: this.slots.map(slot => ([slot.character.charCodeAt(0), slot.width, slot.height])),
                base: this.base,
                presetName: this.presetName
            }

            this.cachedCode = btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
        }

        return this.cachedCode
    }

    public get readmeContent(): string {
        return `
        1) Open template.png in a graphics editor of your choice.
        2) Draw characters inside the yellow boundaries. Horizontal lines between them determine the letter base.
        2) Upload template.png and template.calligro back to Calligro (step 2: font)
        3) Generate your font

        More info at https://calligro.ideasalmanac.com
        `.trim()
    }

    public async copyOnto(ctx: CanvasRenderingContext2D): Promise<void> {
        await this.generateImageBlob()

        ctx.drawImage(this.canvas, 0, 0)
    }
}
