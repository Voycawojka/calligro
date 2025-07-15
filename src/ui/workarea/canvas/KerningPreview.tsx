import { KerningPair, ProjectData } from "../../../filesystem/projectstore"
import { useEffect, useRef, useState } from "react"
import { drawPreview } from "../../../generation/preview"
import { FontSpec, generateFont } from "../../../generation/font/Font"
import { calculateTemplateData, generateTemplateImage } from "../../../generation/template/template"
import { Card } from "@blueprintjs/core"
import useResizeObserver from "@react-hook/resize-observer"
import { useProjectState } from "../hooks/useProjectState"

export interface Props {
    project: ProjectData
    kerning: KerningPair
}

export default function KerningPreview({ project, kerning }: Props) {
    const [scale] = useProjectState("previewScale", project)
    const [bgColor] = useProjectState("previewBgColor", project)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [font, setFont] = useState<[FontSpec, Blob[]] | null>(null)

    const canvasParentRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = (project.importedTemplate?.defaultCharacterWidth ?? project.defaultCharacterWidth) * 6
            canvasRef.current.height = (project.importedTemplate?.defaultCharacterHeight ?? project.defaultCharacterHeight) * 1.2
            setCtx(canvasRef.current.getContext("2d"))
        }
    }, [canvasRef.current])

    useEffect(() => {
        const generate = async () => {
            const templateData = calculateTemplateData(project, "current or imported")
            templateData.project.kernings = [kerning]
            const templateImage = await generateTemplateImage(templateData)
            const font = await generateFont(templateData, templateImage)
            
            setFont(font)
        }
        generate()
    }, [project, kerning])

    useEffect(() => {
        if (ctx && font) {
            const draw = async () => {
                const [spec, pages] = font
                drawPreview(`${String.fromCharCode(kerning.first)}${String.fromCharCode(kerning.second)}`, spec, pages, scale, ctx)
            }
            draw()
        }
    }, [kerning, kerning, ctx, font])

    useResizeObserver(canvasParentRef, entry => {
        if (canvasRef.current) {
            canvasRef.current.width = entry.contentRect.width
            if (ctx && font) {
                const [spec, pages] = font
                drawPreview(`${String.fromCharCode(kerning.first)}${String.fromCharCode(kerning.second)}`, spec, pages, scale, ctx)
            }
        }
    })

    return (
        <Card ref={canvasParentRef} style={{ backgroundColor: bgColor }}>
            <canvas ref={canvasRef} />
        </Card>
    )
}
