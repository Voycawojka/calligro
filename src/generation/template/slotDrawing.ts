import PixelPerfectDrawer from '../../utils/PixelPerfectDrawer'
import { FontOptions } from './Template'
import { Slot } from './types'

type DrawSlotOptions = {
    enclosingSpaceX: number,
    enclosingSpaceY: number,
    enclosingSpaceW: number,
    enclosingSpaceH: number,
    base: number,
    vertMargin: number,
    font: FontOptions | null
}

export function drawSlot(ctx: CanvasRenderingContext2D, slot: Slot, options: DrawSlotOptions): void {
    const { enclosingSpaceX, enclosingSpaceY, enclosingSpaceW, enclosingSpaceH, base, vertMargin } = options

    const slotX = enclosingSpaceW / 2 - slot.width / 2
    const slotY = enclosingSpaceH / 2 - slot.height / 2

    new PixelPerfectDrawer(enclosingSpaceX, enclosingSpaceY, enclosingSpaceW, enclosingSpaceH, ctx)
        .fillRect(0, 0, enclosingSpaceW + 1, enclosingSpaceH + 1, '#f2f2f2')
        .strokeRect(0, 0, enclosingSpaceW + 1, enclosingSpaceH + 1, '#202020')
        .strokeHorizontalLine(0, slotY + base, enclosingSpaceW, '#ffd76c')
        .clearRect(slotX, slotY, slot.width, slot.height)
        .strokeRect(slotX, slotY, slot.width, slot.height, '#ffd76c')
        .flush()
    
    if (options.font) {
        const absSlotY = enclosingSpaceY + enclosingSpaceH / 2 - slot.height / 2

        ctx.fillStyle = options.font.fillColor
        ctx.strokeStyle = options.font.outlineColor
        ctx.font = `${0.9 * base}px ${options.font.name}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(slot.character, enclosingSpaceX + enclosingSpaceW / 2, absSlotY + base, enclosingSpaceW)
        ctx.strokeText(slot.character, enclosingSpaceX + enclosingSpaceW / 2, absSlotY + base, enclosingSpaceW)
    }

    ctx.fillStyle = '#202020'
    ctx.font = `${vertMargin * 0.8}px serif`
    ctx.textAlign = 'center'
    ctx.fillText(slot.character, enclosingSpaceX + enclosingSpaceW / 2, enclosingSpaceY + enclosingSpaceH - vertMargin / 4, enclosingSpaceW)
}

export async function drawLogo(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): Promise<void> {
    await new Promise<void>(resolve => {
        const image = new Image()
        image.onload = () => {
            const size = Math.min(w, h)

            
            ctx.imageSmoothingEnabled = true
            ctx.drawImage(image, x, y, size, size)
            ctx.imageSmoothingEnabled = false
            resolve()
        }
        image.src = '/logo192.png'
    })
}
