import { convertToPngBlob, createCanvas } from '../../utils/canvasHelpers'
import { drawSlot } from './slotDrawing'
import { ProjectData } from '../../filesystem/projectstore'
import { AsepriteWriter } from './aseprite'

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

interface TemplateDrawOptions {
    grid: boolean,
    prefill: boolean,
}

export function getSlotPosition(index: number, templateData: TemplateData): { x: number, y: number } {
    return {
        x: (index % templateData.horizontalSlots) * templateData.slotOuterWidth,
        y: Math.floor(index / templateData.verticalSlots) * templateData.slotOuterHeight,
    }
}

function drawTemplate(ctx: CanvasRenderingContext2D, templateData: TemplateData, drawOptions: TemplateDrawOptions) {
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
            font: drawOptions.prefill && templateData.project.prefill !== null ? {
                name: templateData.project.prefill,
                fillColor: templateData.project.prefillColor,
                outline: templateData.project.prefillOutline,
                outlineColor: templateData.project.prefillOutlineColor,
            } : null,
            grid: drawOptions.grid,
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

export async function generateTemplatePng(templateData: TemplateData): Promise<Blob> {
    if (templateData.mode === "current or imported" && templateData.project.importedTemplate) {
        // imported template already is a PNG so no need to regenerate it
        return templateData.project.importedTemplate.image
    }

    const [canvas, ctx] = createCanvas(templateData.totalWidth, templateData.totalHeight, "white")

    drawTemplate(ctx, templateData, { grid: true, prefill: true })
    return await convertToPngBlob(canvas)
}

export async function generateTemplateAseprite(templateData: TemplateData): Promise<Blob> {
    const [, bgCtx] = createCanvas(templateData.totalWidth, templateData.totalHeight, "white")
    const [, gridCtx] = createCanvas(templateData.totalWidth, templateData.totalHeight, "transparent")
    const [, prefillCtx] = createCanvas(templateData.totalWidth, templateData.totalHeight, "transparent")

    drawTemplate(gridCtx, templateData, { grid: true, prefill: false })
    drawTemplate(prefillCtx, templateData, { grid: false, prefill: true })
   
    const bgImage = bgCtx.getImageData(0, 0, templateData.totalWidth, templateData.totalHeight, { colorSpace: "srgb" })
    const gridImage = gridCtx.getImageData(0, 0, templateData.totalWidth, templateData.totalHeight, { colorSpace: "srgb" })
    const prefillImage = prefillCtx.getImageData(0, 0, templateData.totalWidth, templateData.totalHeight, { colorSpace: "srgb" })

    const file = new AsepriteWriter()

    file.beginFile(templateData)
        file.beginFrame()
            file.layer("background")
            file.layer("grid")
            templateData.project.prefill && file.layer("prefill")

            await file.cel(0, bgImage)
            await file.cel(1, gridImage)
            templateData.project.prefill && await file.cel(2, prefillImage)
        file.endFrame()
    file.endFile()

    return file.getBlob()
}
