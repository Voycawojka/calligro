import PixelPerfectDrawer from '../../utils/PixelPerfectDrawer'
import { FontOptions } from './template'
import { Slot } from './types'

type DrawSlotOptions = {
    enclosingSpaceX: number,
    enclosingSpaceY: number,
    enclosingSpaceW: number,
    enclosingSpaceH: number,
    base: number,
    vertMargin: number,
    font: FontOptions | null,
    grid: boolean,
}

export function drawSlot(ctx: CanvasRenderingContext2D, slot: Slot, options: DrawSlotOptions): void {
    const { enclosingSpaceX, enclosingSpaceY, enclosingSpaceW, enclosingSpaceH, base } = options

    const slotX = Math.floor(enclosingSpaceW / 2) - Math.floor(slot.width / 2)
    const slotY = Math.floor(enclosingSpaceH / 2) - Math.floor(slot.height / 2)

    if (options.grid) {
        new PixelPerfectDrawer(enclosingSpaceX, enclosingSpaceY, enclosingSpaceW, enclosingSpaceH, ctx)
            .fillRect(0, 0, enclosingSpaceW, enclosingSpaceH, '#ffffff')
            .strokeHorizontalLine(0, slotY + base, enclosingSpaceW, '#bebebe')
            .clearRect(slotX, slotY, slot.width, slot.height)
            .strokeRect(slotX, slotY, slot.width, slot.height, '#bebebe')
            .flush()
    }
    
    if (options.font) {
        const absSlotY = enclosingSpaceY + Math.floor(enclosingSpaceH / 2) - Math.floor(slot.height / 2)

        ctx.fillStyle = options.font.fillColor
        ctx.strokeStyle = options.font.outlineColor
        ctx.lineWidth = options.font.outline
        ctx.font = `${0.9 * base}px ${options.font.name}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(slot.character, enclosingSpaceX + Math.floor(enclosingSpaceW / 2), absSlotY + base, enclosingSpaceW)
        if (options.font.outline > 0) {
            ctx.strokeText(slot.character, enclosingSpaceX + Math.floor(enclosingSpaceW / 2), absSlotY + base, enclosingSpaceW)
        }
    }
}
