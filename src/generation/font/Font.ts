import { convertToBlob } from '../../utils/canvasHelpers';
import { blobToCanvas } from '../fs/image';
import { packFromSheet, SourceRect } from '../packing/imagePacking';
import Template from '../template/Template';
import { CodePayload } from '../template/types';

export interface FontSpec {
    info: {
        face: string
        size: number
        stretchH: number
        aa: number
        padding: {
            up: number
            right: number
            down: number
            left: number
        }
        spacing: {
            horizontal: number
            vertical: number
        }
        outline: number
    }
    common: {
        lineHeight: number
        base: number
        scaleW: number
        scaleH: number
        pages: number
    }
    pages: {
        id: number
        file: string
    }[]
    chars: {
        id: number
        x: number
        y: number
        width: number
        height: number
        xoffset: number
        yoffset: number
        xadvance: number
        page: number
        chnl: 1 | 2 | 4 | 8 | 15
    }[]
    kernings: {
        first: number
        second: number
        amount: number
    }[]
}

export interface KerningPair {
    first: number
    second: number
    amount: number
}

export interface FontConfig {
    horizontalSpacing: number
    verticalSpacing: number
    lineHeight: number
    kernings: KerningPair[]
}

export async function generateFont(templateImg: Blob, tempConfig: CodePayload, fontConfig: FontConfig): Promise<[FontSpec, Blob[]]> {
    const slots = tempConfig.slots.map(([ unicode, width, height ]) => ({ character: String.fromCharCode(unicode), width, height }))
    const template = new Template(slots, tempConfig.base)

    const [canvas] = await blobToCanvas(templateImg)

    const sourceRects: SourceRect[] = slots.map((slot, index) => ({
        slot,
        x: template.getSlotPosition(index + 1).x + template.slotDim.w / 2 - (slot.width - 2) / 2,
        y: template.getSlotPosition(index + 1).y + template.slotDim.h / 2 - (slot.height - 2) / 2,
        w: slot.width - 2,
        h: slot.height - 2
    }))

    const [packedTexture, packedRects] = packFromSheet(canvas, sourceRects)
    const packedBlob = await convertToBlob(packedTexture)

    const specification: FontSpec = {
        info: {
            face: 'calligro-custom',
            size: 12,
            stretchH: 100,
            aa: 1,
            padding: {
                up: 0,
                right: 0,
                down: 0,
                left: 0
            },
            spacing: {
                horizontal: fontConfig.horizontalSpacing,
                vertical: fontConfig.verticalSpacing
            },
            outline: 0
        },
        common: {
            lineHeight: fontConfig.lineHeight,
            base: tempConfig.base,
            scaleW: canvas.width,
            scaleH: canvas.height,
            pages: 1
        },
        pages: [
            {
                id: 0,
                file: 'calligro-page-0.png'
            }
        ],
        chars: packedRects.map(rect => ({
            id: rect.sourceRect.slot.character.charCodeAt(0),
            x: rect.x,
            y: rect.y,
            width: rect.sourceRect.w,
            height: rect.sourceRect.h,
            xoffset: 0,
            yoffset: 0,
            xadvance: rect.sourceRect.w,
            page: 0,
            chnl: 15
        })),
        kernings: fontConfig.kernings
    }

    return [specification, [packedBlob]]
}
