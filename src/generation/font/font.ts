import { convertToBlob } from '../../utils/canvasHelpers'
import { blobToCanvas } from '../fs/image'
import { packFromSheet, SourceRect } from '../packing/imagePacking'
import { getSlotPosition, TemplateData } from '../template/template'

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

export async function generateFont(templateData: TemplateData, templateImage: Blob): Promise<[FontSpec, Blob[]]> {
    const [canvas] = await blobToCanvas(templateImage)

    const sourceRects: SourceRect[] = []
    for (let i = 0; i < templateData.project.characterSet.length; i++) {
        const character = templateData.project.characterSet.charCodeAt(i)

        let slotWidth = templateData.project.defaultCharacterWidth
        let slotHeight = templateData.project.defaultCharacterHeight

        const sizeOverride = templateData.project.sizeOverrides.find(override => override.char === character)
        if (sizeOverride) {
            slotWidth = sizeOverride.width
            slotHeight = sizeOverride.height
        }

        sourceRects.push({
            character,
            x: getSlotPosition(i + 1, templateData).x + Math.floor(templateData.slotOuterWidth / 2) - Math.floor((slotWidth - 2) / 2),
            y: getSlotPosition(i + 1, templateData).y + Math.floor(templateData.slotOuterHeight / 2) - Math.floor((slotHeight - 2) / 2),
            w: slotWidth - 2,
            h: slotHeight - 2
        })
    }

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
                left: 0,
            },
            spacing: {
                horizontal: templateData.project.horizontalSpacing,
                vertical: templateData.project.verticalSpacing,
            },
            outline: 0,
        },
        common: {
            lineHeight: templateData.project.lineHeight,
            base: templateData.project.characterBase,
            scaleW: canvas.width,
            scaleH: canvas.height,
            pages: 1,
        },
        pages: [
            {
                id: 0,
                file: 'calligro-page-0.png'
            }
        ],
        chars: packedRects.map(rect => ({
            id: rect.sourceRect.character,
            x: rect.x,
            y: rect.y,
            width: rect.sourceRect.w,
            height: rect.sourceRect.h,
            xoffset: 0,
            yoffset: 0,
            xadvance: rect.sourceRect.w,
            page: 0,
            chnl: 15,
        })),
        kernings: templateData.project.kernings,
    }

    return [specification, [packedBlob]]
}
