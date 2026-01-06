import { TemplateData } from "./template"

export class AsepriteWriter {
    private buffer = new Uint8Array(1024)
    private view = new DataView(this.buffer.buffer)
    private index = 0
    private sizeAtLastFrameBegin = 0
    private chunkCountInCurrentFrame = 0

    getBlob(): Blob {
        return new Blob([this.buffer.slice(0, this.index)])
    }

    beginFile(templateData: TemplateData) {
        this.dword(0)                                   // File size (set later)
        this.word(0xA5E0)                               // Magic number
        this.word(1)                                    // Frames
        this.word(templateData.totalWidth)              // Width
        this.word(templateData.totalHeight)             // Height
        this.word(32)                                   // Color depth (RGBA)
        this.dword(0)                                   // Flags
        this.word(0)                                    // Speed (deprecated)
        this.dword(0)                                   // 0
        this.dword(0)                                   // 0
        this.byte(0)                                    // Transparent color (unused in RGBA)
        this.byte(0)                                    // Ignore
        this.byte(0)                                    // Ignore
        this.byte(0)                                    // Ignore
        this.word(0)                                    // Number of colors (unused in RGBA)
        this.byte(1)                                    // Pixel width
        this.byte(1)                                    // Pixel height
        this.short(0)                                   // Grid x
        this.short(0)                                   // Grid y
        this.word(templateData.slotOuterWidth)          // Grid width
        this.word(templateData.slotOuterHeight)         // Grid height
        this.bytes(new Uint8Array(84))                  // Unused
    }

    beginFrame() {
        this.sizeAtLastFrameBegin = this.index
        this.chunkCountInCurrentFrame = 0

        this.dword(0)       // Frame bytes (set later)
        this.word(0xF1FA)   // Magic number
        this.word(0)        // Number of chunks (set later)
        this.word(100)      // Frame duration (not important)
        this.byte(0)        // Unused
        this.byte(0)        // Unused
        this.dword(0)       // Number of chunks (read from previous number of chunks field)
    }

    layer(name: string) {
        const sizeBefore = this.index

        this.dword(0)      // Chunk size (set later)
        this.word(0x2004)  // Chunk type (layer)
        this.word(1 | 2)   // Flags (visible, editable)
        this.word(0)       // Layer type (normal)
        this.word(0)       // Child level
        this.word(0)       // Ignored
        this.word(0)       // Ignored
        this.word(0)       // Blend mode (normal)
        this.byte(255)     // Opacity
        this.byte(0)       // Unused
        this.byte(0)       // Unused
        this.byte(0)       // Unused
        this.str(name)     // Name

        const chunkSize = this.index - sizeBefore
        this.view.setUint32(sizeBefore, chunkSize >>> 0, true)

        this.chunkCountInCurrentFrame++
    }

    async cel(layerIndex: number, imageData: ImageData) {
        const sizeBefore = this.index
        const compressedStream = new Blob([imageData.data])
            .stream()
            .pipeThrough(new CompressionStream("deflate"))
        const image = new Uint8Array(await new Response(compressedStream).arrayBuffer())

        this.dword(0)               // Chunk size (set later)
        this.word(0x2005)           // Chunk type (cel)
        this.word(layerIndex)       // Layer index
        this.short(0)               // Position x
        this.short(0)               // Position y
        this.byte(255)              // Opacity
        this.word(2)                // Type (compressed image)
        this.short(0)               // Z-index (default layer ordering)
        this.byte(0)                // Unused
        this.byte(0)                // Unused
        this.byte(0)                // Unused
        this.byte(0)                // Unused
        this.byte(0)                // Unused
        this.word(imageData.width)  // Width
        this.word(imageData.height) // Height
        this.bytes(image)           // Compressed image

        const chunkSize = this.index - sizeBefore
        this.view.setUint32(sizeBefore, chunkSize >>> 0, true)

        this.chunkCountInCurrentFrame++
    }

    endFrame() {
        const chunkSize = this.index - this.sizeAtLastFrameBegin
        this.view.setUint32(this.sizeAtLastFrameBegin, chunkSize >>> 0, true)
        this.view.setUint16(this.sizeAtLastFrameBegin + 6, this.chunkCountInCurrentFrame & 0xFFFF, true)
    }

    endFile() {
        this.view.setUint32(0, this.index >>> 0, true)
    }

    private resizeToFit(additionalSize: number) {
        const neededSize = this.index + additionalSize
        
        if (neededSize <= this.buffer.length) {
            return
        }

        let newSize = this.buffer.length
        do {
            newSize *= 2
        } while (newSize <= neededSize)

        const newBuffer = new Uint8Array(newSize)
        newBuffer.set(this.buffer)

        this.buffer = newBuffer
        this.view = new DataView(this.buffer.buffer)
    }

    private byte(v: number) {
        this.resizeToFit(1)
        this.view.setUint8(this.index, v & 0xFF)
        this.index++
    }

    private word(v: number) {
        this.resizeToFit(2)
        this.view.setUint16(this.index, v & 0xFFFF, true)
        this.index += 2
    }

    private short(v: number) {
        this.resizeToFit(2)
        this.view.setInt16(this.index, v | 0, true)
        this.index += 2
    }

    private dword(v: number) {
        this.resizeToFit(4)
        this.view.setUint32(this.index, v >>> 0, true)
        this.index += 4
    }

    private bytes(arr: Uint8Array) { 
        this.resizeToFit(arr.length)
        this.buffer.set(arr, this.index)
        this.index += arr.length
    }

    private str(v: string) {
        const encoder = new TextEncoder().encode(v)
        this.word(encoder.length)
        this.bytes(encoder)
    }
}
