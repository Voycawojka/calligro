function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    return text
        .split('\n')
        .map(paragraph => paragraph.split(' '))
        .flatMap(words => {
            const lines: string[][] = [[]]

            words.forEach(word => {
                const currentLine = lines[lines.length-1]
                const width = ctx.measureText(`${currentLine.join(' ')} ${word}`).width

                if (width < maxWidth) {
                    currentLine.push(word)
                } else {
                    lines.push([word])
                }
            })

            return lines.map(words => words.join(' '))
        })
}

export function createCanvas(width: number, height: number, color: string): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('Your browser doesn\'t support 2d canvas context. Use a modern browser, please.')
    }

    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    return [canvas, ctx]
}

type DrawWrappedTextOptions = {
    x: number,
    y: number,
    size: number,
    maxWidth: number,
    maxHeight?: number
}

export function drawWrappedText(ctx: CanvasRenderingContext2D, text: string, options: DrawWrappedTextOptions): void {
    const { x, y, size, maxWidth, maxHeight } = options
    let trySize = size

    ctx.font = `${trySize}px serif`
    let lines = wrapText(ctx, text, maxWidth)

    if (maxHeight) {
        
        while (lines.length * trySize >= maxHeight) {
            trySize --

            ctx.font = `${trySize}px serif`
            lines = wrapText(ctx, text, maxWidth)
        }
    }

    lines.forEach((line, i) => ctx.fillText(line, x, y + i * trySize, maxWidth))
}
