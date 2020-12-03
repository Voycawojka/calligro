import { drawWrappedText } from "./canvasHelpers"
import { Slot } from "./types"

type DrawSlotOptions = {
    x: number,
    y: number,
    w: number,
    h: number,
    base: number,
    vertMargin: number
}

export function drawSlot(ctx: CanvasRenderingContext2D, slot: Slot, options: DrawSlotOptions): void {
    const { x, y, w, h, base, vertMargin } = options

    ctx.strokeStyle = 'black'
    ctx.strokeRect(x, y, w, h)

    const charRectX = x + w / 2 - slot.width / 2
    const charRectY = y + h / 2 - slot.height / 2

    ctx.strokeStyle = 'red'
    ctx.clearRect(charRectX, charRectY, slot.width, slot.height)
    ctx.strokeRect(charRectX, charRectY, slot.width, slot.height)
    ctx.setLineDash([5, 15])
    ctx.beginPath()
    ctx.moveTo(charRectX, charRectY + base)
    ctx.lineTo(charRectX + slot.width, charRectY + base)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = 'black'
    ctx.font = `${vertMargin * 0.8}px serif`
    ctx.textAlign = 'center'
    ctx.fillText(slot.character, x + w / 2, y + h - vertMargin / 4, w)
}

export function drawInfo(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    const info = `1) Draw characters inside the red boundaries*.

2) Upload this file back to Calligro

3) Paste the template code and you got yourself a font

*Dashed lines signify the letter base.
    `.replaceAll('\t', '')

    ctx.fillStyle = 'black'
    ctx.textAlign = 'left'
    drawWrappedText(ctx, info, {
        x: x + w * 0.05,
        y: y + h * 0.1,
        maxWidth: w * 0.9,
        maxHeight: h * 0.8,
        size: h / 5
    })
}
