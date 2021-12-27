export default class PixelPerfectDrawer {
    private imageData: ImageData

    constructor(
        private spaceX: number,
        private spaceY: number,
        private spaceW: number,
        spaceH: number,
        private ctx: CanvasRenderingContext2D
    ) {
        this.imageData = ctx.createImageData(spaceW, spaceH)
    }

    private getColorIndices(x: number, y: number): { r: number, g: number, b: number, a: number } {
        const index = Math.ceil(y) * (Math.ceil(this.spaceW) * 4) + Math.ceil(x) * 4
        
        return {
            r: index,
            g: index + 1,
            b: index + 2,
            a: index + 3
        }
    }

    private hexToRgb(color: string): { r: number, g: number, b: number } {
        const asNumber = parseInt(color.substring(1), 16)

        return {
            r: (asNumber >> 16) & 255,
            g: (asNumber >> 8) & 255,
            b: asNumber & 255
        }
      }

    public setPixel(x: number, y: number, color: string): PixelPerfectDrawer {
        const rgb = this.hexToRgb(color)
        const index = this.getColorIndices(x, y)

        this.imageData.data[index.r] = rgb.r
        this.imageData.data[index.g] = rgb.g
        this.imageData.data[index.b] = rgb.b
        this.imageData.data[index.a] = 255

        return this
    }

    public clearPixel(x: number, y: number): PixelPerfectDrawer {
        const index = this.getColorIndices(x, y)

        this.imageData.data[index.r] = 0
        this.imageData.data[index.g] = 0
        this.imageData.data[index.b] = 0
        this.imageData.data[index.a] = 0

        return this
    }

    public flush() {
        this.ctx.putImageData(this.imageData, this.spaceX, this.spaceY)
    }

    public strokeHorizontalLine(x: number, y: number, length: number, color: string): PixelPerfectDrawer {
        for (let i = 0; i < length; i++) {
            this.setPixel(x + i, y, color)
        }

        return this
    }

    public strokeVerticalLine(x: number, y: number, length: number, color: string): PixelPerfectDrawer {
        for (let i = 0; i < length; i++) {
            this.setPixel(x, y + i, color)
        }

        return this
    }

    public strokeRect(x: number, y: number, width: number, height: number, color: string): PixelPerfectDrawer {
        return this
            .strokeHorizontalLine(x, y, width, color)
            .strokeHorizontalLine(x, y + height - 1, width, color)
            .strokeVerticalLine(x, y, height, color)
            .strokeVerticalLine(x + width - 1, y, height, color)
    }

    public fillRect(x: number, y: number, width: number, height: number, color: string): PixelPerfectDrawer {
        for (let i = 0; i < width; i++) {
            this.strokeVerticalLine(x + i, y, height, color)
        }

        return this
    }

    public clearRect(x: number, y: number, width: number, height: number): PixelPerfectDrawer {
        for (let px = 0; px < width; px++) {
            for (let py = 0; py < height; py++) {
                this.clearPixel(px + x, py + y)
            }
        }

        return this
    }
}

