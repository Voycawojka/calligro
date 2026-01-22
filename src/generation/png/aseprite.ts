import Aseprite from "ase-parser";
import { convertToPngBlob, createCanvas } from "../../utils/canvasHelpers";

export async function asepriteToPng(file: File): Promise<Blob> {
    const aseBuffer = Buffer.from(await file.arrayBuffer())
    const ase = new Aseprite(aseBuffer, file.name)

    ase.parse()

    const [canvas, ctx] = createCanvas(ase.width, ase.height)
    const frame = ase.frames[0]
    const cels = frame.cels.sort(compareCels)

    for (const cel of cels) {
        const layer = ase.layers[cel.layerIndex]
        if (layer.opacity === 0) {
            continue
        }

        const imageData = ctx.createImageData(cel.w, cel.h)
        const data = imageData.data
        const raw = cel.rawCelData

        if (ase.colorDepth === 32) { // RGBA
            for (let i = 0; i < raw.length; i++) {
                data[i] = raw[i]
            }
        } else if (ase.colorDepth === 8) { // Indexed
            for (let i = 0; i < raw.length; i++) {
                const colorIndex = raw[i]
                const color = ase.palette.colors[colorIndex]
                const offset = i * 4

                if (color) {
                    data[offset] = color.red
                    data[offset + 1] = color.green
                    data[offset + 2] = color.blue
                    data[offset + 3] = color.alpha
                }
            }
        } else if (ase.colorDepth === 16) { // Grayscale
            for (let i = 0; i < raw.length / 2; i++) {
                const val = raw[i * 2]
                const alpha = raw[i * 2 + 1]
                const offset = i * 4
                data[offset] = val
                data[offset + 1] = val
                data[offset + 2] = val
                data[offset + 3] = alpha
            }
        }

        ctx.putImageData(imageData, cel.xpos, cel.ypos)
    }

    return await convertToPngBlob(canvas)
}

function compareCels(a: Aseprite.Cel, b: Aseprite.Cel) {
    const orderA = a.layerIndex + a.zIndex
    const orderB = b.layerIndex + b.zIndex

    return orderA - orderB || a.zIndex - b.zIndex
}
