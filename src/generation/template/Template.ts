import { convertToBlob, createCanvas } from '../../utils/canvasHelpers'
import { drawSlot } from './slotDrawing'
import { ProjectData } from '../../filesystem/projectstore'

export interface FontOptions {
    name: string
    fillColor: string
    outlineColor: string
}

export interface TemplateData {
    totalWidth: number,
    totalHeight: number,
    horizontalSlots: number,
    verticalSlots: number,
    slotOuterWidth: number,
    slotOuterHeight: number,
    slotHorizontalMargin: number,
    project: ProjectData,
}

export function getSlotPosition(index: number, templateData: TemplateData): { x: number, y: number } {
    return {
        x: (index % templateData.horizontalSlots) * templateData.slotOuterWidth,
        y: Math.floor(index / templateData.verticalSlots) * templateData.slotOuterHeight,
    }
}

async function drawTemplate(ctx: CanvasRenderingContext2D, templateData: TemplateData) {
    ctx.imageSmoothingEnabled = false
    
    for (let i = 0; i < templateData.project.characterSet.length; i++) {
        const { x, y } = getSlotPosition(i + 1, templateData)

        // TODO take size overrides into account
        const slot = {
            character: templateData.project.characterSet[i],
            width: templateData.project.defaultCharacterWidth,
            height: templateData.project.defaultCharacterHeight
        }
        
        drawSlot(ctx, slot, {
            enclosingSpaceX: x,
            enclosingSpaceY: y,
            enclosingSpaceW: templateData.slotOuterWidth,
            enclosingSpaceH: templateData.slotOuterHeight,
            base: templateData.project.characterBase,
            vertMargin: templateData.slotHorizontalMargin,
            // TODO actual options
            font: templateData.project.prefill !== null ? {
                name: templateData.project.prefill,
                fillColor: "#110000",
                outlineColor: "#001100",
            } : null
        })
    }
}

export function calculateTemplateData(project: ProjectData): TemplateData {
    const horizontalSlots = Math.ceil(Math.sqrt(project.characterSet.length + 1))
    const verticalSlots = Math.ceil(Math.sqrt(project.characterSet.length + 1))

    // const maxW = Math.max.apply(null, slots.map(slot => slot.width))
    // const maxH = Math.max.apply(null, slots.map(slot => slot.height))
    // TODO take dimension overrides into account
    const maxCharacterWidth = project.defaultCharacterWidth
    const maxCharacterHeight = project.defaultCharacterHeight

    const slotOuterWidth = Math.round(maxCharacterWidth * 1.3)
    const slotOuterHeight = Math.max(Math.round(maxCharacterHeight * 1.3), 30)
    const slotHorizontalMargin = Math.ceil((slotOuterHeight - maxCharacterHeight) / 2)

    const totalWidth = horizontalSlots * slotOuterWidth
    const totalHeight = verticalSlots * slotOuterHeight

    return {
        totalWidth,
        totalHeight,
        horizontalSlots,
        verticalSlots,
        slotOuterWidth,
        slotOuterHeight,
        slotHorizontalMargin,
        project,
    }
}

export async function generateTemplateImage(templateData: TemplateData) {
    const [canvas, ctx] = createCanvas(templateData.totalWidth, templateData.totalHeight, "white")

    await drawTemplate(ctx, templateData)
    return await convertToBlob(canvas)
}

// export async function copyOnto(ctx: CanvasRenderingContext2D): Promise<void> {
//     await this.generateImageBlob()

//     const aspectRatio = this.canvas.width / this.canvas.height;
//     const canvasAspectRatio = ctx.canvas.width / ctx.canvas.height;

//     let drawWidth, drawHeight, offsetX, offsetY;

//     if (aspectRatio > canvasAspectRatio) {
//         drawWidth = ctx.canvas.width;
//         drawHeight = ctx.canvas.width / aspectRatio;
//         offsetX = 0;
//         offsetY = (ctx.canvas.height - drawHeight) / 2;
//     } else {
//         drawWidth = ctx.canvas.height * aspectRatio;
//         drawHeight = ctx.canvas.height;
//         offsetX = (ctx.canvas.width - drawWidth) / 2;
//         offsetY = 0;
//     }

//     ctx.drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, offsetX, offsetY, drawWidth, drawHeight);
// }
