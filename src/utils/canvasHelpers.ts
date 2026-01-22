export function createCanvas(width: number, height: number, color?: string): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.style.imageRendering = 'crisp-edges'

    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error("Unsupported browser")
    }

    ctx.imageSmoothingEnabled = false

    if (color) {
        ctx.fillStyle = color
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    return [canvas, ctx]
}

export function convertToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => blob ? resolve(blob) : reject(), 'image/png', 1)
    })
}
