import { createCanvas } from "../../utils/canvasHelpers"

export function blobToCanvas(blob: Blob): Promise<[HTMLCanvasElement, CanvasRenderingContext2D]> {
    return new Promise(resolve => {
        const dataUrl = URL.createObjectURL(blob)
        const image = document.createElement('img')

        image.onload = () => {
            const [canvas, ctx] = createCanvas(image.width, image.height)

            ctx.drawImage(image, 0, 0)

            image.remove()
            URL.revokeObjectURL(dataUrl)

            resolve([canvas, ctx])
        }

        image.src = dataUrl
    })
}
