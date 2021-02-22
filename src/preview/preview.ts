import { FontSpec } from "../generation/font/Font";

function blobsToTextures(blobs: Blob[]): Promise<HTMLImageElement[]> {
    const textures: HTMLImageElement[] = []

    return new Promise(resolve => blobs.forEach(blob => {
        const img = new Image()

        img.onload = () => {
            textures.push(img)
            if (textures.length === blobs.length) {
                resolve(textures)
            }
        }

        img.src = URL.createObjectURL(blob)
    }))
}

function getKerningAmount(text: string, charIndex: number, spec: FontSpec): number {
    if (charIndex <= 0 || charIndex >= text.length) {
        return 0
    }

    const charCode1 = text.charCodeAt(charIndex - 1)
    const charCode2 = text.charCodeAt(charIndex)
    const kerning = spec.kernings.find(({ first, second }) => first === charCode1 && second === charCode2)

    return kerning?.amount ?? 0
}

export async function drawPreview(text:string, spec: FontSpec, pages: Blob[], scale: number, ctx: CanvasRenderingContext2D): Promise<void> {
    const textures = await blobsToTextures(pages)
    const cursor = {
        x: spec.info.padding.left,
        y: spec.info.padding.up
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.strokeStyle = 'black'

    ;[...text].forEach((c, i) => {
        if (c === '\n') {
            cursor.x = 0
            cursor.y += spec.info.spacing.vertical + spec.common.lineHeight
            return
        }

        let charSpec = spec.chars.find(char => char.id === c.charCodeAt(0))
        let placeholder = false

        if (!charSpec) {
           charSpec = spec.chars[0]
           placeholder = true
        }

        const kerningAmount = placeholder ? 0 : getKerningAmount(text, i, spec)
        const texture = textures[charSpec.page]

        const pos = {
            x: cursor.x + charSpec.xoffset + kerningAmount,
            y: cursor.y + charSpec.yoffset
        }

        if ((pos.x + charSpec.width) * scale >= ctx.canvas.width) {
            cursor.x = 0
            cursor.y += spec.info.spacing.vertical + spec.common.lineHeight

            pos.x = cursor.x + charSpec.xoffset + kerningAmount
            pos.y = cursor.y + charSpec.yoffset
        }

        if (placeholder) {
            const x = pos.x + charSpec.width / 4
            const y = pos.y + charSpec.height / 4
            const w = charSpec.width * 2/4
            const h = charSpec.height * 2/4

            ctx.strokeRect(x * scale, y * scale, w * scale, h * scale)
        } else {
            ctx.drawImage(texture, charSpec.x, charSpec.y, charSpec.width, charSpec.height, pos.x * scale, pos.y * scale, charSpec.width * scale, charSpec.height * scale)
        }

        cursor.x += charSpec.xadvance + spec.info.spacing.horizontal + kerningAmount
    })
}