import { KerningPair, ProjectData } from "../../../filesystem/projectstore"
import { useEffect, useRef, useState } from "react"
import { drawPreview } from "../../../preview/preview"
import { FontSpec, generateFont } from "../../../generation/font/Font"
import { calculateTemplateData, generateTemplateImage } from "../../../generation/template/template"

export interface Props {
    project: ProjectData
    kerning: KerningPair
}

export default function KerningPreview({ project, kerning }: Props) {
    const [ctx, setCtx] = useState(null as CanvasRenderingContext2D | null)
    const [font, setFont] = useState(null as [FontSpec, Blob[]] | null)

    const canvasRef = useRef(null as HTMLCanvasElement | null)

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = project.defaultCharacterWidth * 6
            canvasRef.current.height = project.defaultCharacterHeight * 1.2
            setCtx(canvasRef.current.getContext("2d"))
        }
    }, [canvasRef.current])

    useEffect(() => {
        const generate = async () => {
            const templateData = calculateTemplateData(project)
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
                drawPreview(`${String.fromCharCode(kerning.first)}${String.fromCharCode(kerning.second)}`, spec, pages, 1, ctx)
            }
            draw()
        }
    }, [kerning, kerning, ctx, font])

    return (
        <canvas ref={canvasRef} />
    )
}
