import { convertToBlob, createCanvas } from '../../utils/canvasHelpers'
import { drawSlot } from './slotDrawing'
import { ProjectData } from '../../filesystem/projectstore'
import { set } from 'js-cookie'

export interface FontOptions {
    name: string
    fillColor: string
    outline: number
    outlineColor: string
}

export type TemplateMode = "force current" | "current or imported"

export interface TemplateData {
    totalWidth: number
    totalHeight: number
    horizontalSlots: number
    verticalSlots: number
    slotOuterWidth: number
    slotOuterHeight: number
    slotHorizontalMargin: number
    project: ProjectData
    mode: TemplateMode
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

        const slot = {
            character: templateData.project.characterSet[i],
            width: templateData.project.defaultCharacterWidth,
            height: templateData.project.defaultCharacterHeight
        }

        const sizeOverride = templateData.project.sizeOverrides.find(override => override.char === slot.character.charCodeAt(0))
        if (sizeOverride) {
            slot.width = sizeOverride.width
            slot.height = sizeOverride.height
        }
        
        drawSlot(ctx, slot, {
            enclosingSpaceX: x,
            enclosingSpaceY: y,
            enclosingSpaceW: templateData.slotOuterWidth,
            enclosingSpaceH: templateData.slotOuterHeight,
            base: templateData.project.characterBase,
            vertMargin: templateData.slotHorizontalMargin,
            font: templateData.project.prefill !== null ? {
                name: templateData.project.prefill,
                fillColor: templateData.project.prefillColor,
                outline: templateData.project.prefillOutline,
                outlineColor: templateData.project.prefillOutlineColor,
            } : null
        })
    }
}

export function calculateTemplateData(project: ProjectData, mode: TemplateMode): TemplateData {
    let settings = project.importedTemplate ?? project
    if (mode === "force current") {
        settings = project
    }
    
    const horizontalSlots = Math.ceil(Math.sqrt(settings.characterSet.length + 1))
    const verticalSlots = Math.ceil(Math.sqrt(settings.characterSet.length + 1))

    const maxCharacterWidth = Math.max.apply(null, [settings.defaultCharacterWidth, ...project.sizeOverrides.map(override => override.width)])
    const maxCharacterHeight = Math.max.apply(null, [settings.defaultCharacterHeight, ...project.sizeOverrides.map(override => override.height)])

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
        project: {
            ...project,
            defaultCharacterWidth: settings.defaultCharacterWidth,
            defaultCharacterHeight: settings.defaultCharacterHeight,
            characterBase: settings.characterBase,
            characterSet: settings.characterSet,
        },
        mode,
    }
}

export async function generateTemplateImage(templateData: TemplateData) {
    if (templateData.mode === "current or imported" && templateData.project.importedTemplate) {
        return templateData.project.importedTemplate.image
    }

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
