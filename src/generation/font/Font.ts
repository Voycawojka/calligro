import { blobToCanvas } from "../fs/image";
import { parseTemplateCode } from "../template/parse";
import Template from "../template/Template";

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
}

export interface FontConfig {
    horizontalSpacing: number
    verticalSpacing: number
    lineHeight: number
}

export async function generateFont(templateImg: Blob, templateCode: string, fontConfig: FontConfig): Promise<[FontSpec, Blob[]]> {
    const tempConfig = parseTemplateCode(templateCode)
    const slots = tempConfig.slots.map(([ unicode, width, height ]) => ({ character: String.fromCharCode(unicode), width, height }))
    const template = new Template(slots, tempConfig.base)

    const [canvas, ctx] = await blobToCanvas(templateImg)

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
        chars: slots.map((slot, index) => ({
            id: slot.character.charCodeAt(0),
            x: template.getSlotPosition(index + 1).x,
            y: template.getSlotPosition(index + 1).y,
            width: slot.width,
            height: slot.height,
            xoffset: 0,
            yoffset: 0,
            xadvance: slot.width,
            page: 0,
            chnl: 15
        }))
    }

    return [specification, [templateImg]]
}
