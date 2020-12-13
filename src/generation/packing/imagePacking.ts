import { createCanvas } from '../../utils/canvasHelpers'
import { Slot } from '../template/types'

export interface SourceRect {
    x: number,
    y: number,
    w: number,
    h: number,
    slot: Slot
}

export interface PackedRect {
    x: number,
    y: number,
    sourceRect: SourceRect
}

interface PackedData {
    packedRects: PackedRect[],
    width: number,
    height: number
}

function pack(rects: SourceRect[], width: number): PackedData {
    const data: PackedData = {
        packedRects: [],
        width: 0,
        height: 0
    }
    
    let nextX = 0
    let nextY = 0
    let furthestSoFar = 0
    let lowestSoFar = 0

    data.packedRects = rects
        .sort((a, b) => b.h - a.h)
        .map(rect => {
            if (nextX + rect.w > width) {
                nextX = 0
                nextY = lowestSoFar
            }

            if (nextX + rect.w > furthestSoFar) {
                furthestSoFar = nextX + rect.w
            }

            if (nextY + rect.h > lowestSoFar) {
                lowestSoFar = nextY + rect.h
            }

            const packed = {
                x: nextX,
                y: nextY,
                sourceRect: rect
            }

            nextX += rect.w

            return packed
        })
    
    data.width = furthestSoFar
    data.height = lowestSoFar

    return data
}

export function packFromSheet(source: HTMLCanvasElement, rects: SourceRect[]): [HTMLCanvasElement, PackedRect[]] {
    const { width, height, packedRects } = pack(rects, source.width)
    const [canvas, ctx] = createCanvas(width, height)

    packedRects.forEach(({ x, y, sourceRect }) => {
        const { w, h } = sourceRect
        ctx.drawImage(source, sourceRect.x, sourceRect.y, w, h, x, y, w, h)
    })

    return [canvas, packedRects]
}
