import { KerningPair, ProjectData } from "../../../filesystem/projectstore"
import { useEffect, useRef, useState } from "react"
import { drawPreview } from "../../../generation/preview"
import { FontSpec, generateFont } from "../../../generation/font/font"
import { calculateTemplateData, generateTemplatePng } from "../../../generation/template/template"
import { Card } from "@blueprintjs/core"
import useResizeObserver from "@react-hook/resize-observer"
import { useProjectState } from "../hooks/useProjectState"
import { useIncrementingCounter } from "../hooks/useIncrementingCounter"

export interface Props {
    project: ProjectData
    kernings: KerningPair[]
}

export default function KerningPreview({ project, kernings }: Props) {
    const [scale] = useProjectState("previewScale", project)
    const [bgColor] = useProjectState("previewBgColor", project)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [font, setFont] = useState<[FontSpec, Blob[]] | null>(null)
    const previewCounter = useIncrementingCounter(1, 1000)

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
            templateData.project.kernings = [...kernings]
            const templateImage = await generateTemplatePng(templateData)
            const font = await generateFont(templateData, templateImage)
            
            setFont(font)
        }
        generate()
    }, [project, kernings])

    useEffect(() => {
        if (ctx && font) {
            const draw = async () => {
                const [spec, pages] = font
                const leftChar = String.fromCodePoint(kernings[previewCounter % kernings.length]?.first ?? 0)
                const rightChar = String.fromCodePoint(kernings[previewCounter % kernings.length]?.second ?? 0)
                drawPreview(`${leftChar}${rightChar}`, spec, pages, scale, ctx)
            }
            draw()
        }
    }, [kernings, ctx, font, previewCounter])

    useResizeObserver(canvasParentRef, entry => {
        if (canvasRef.current) {
            canvasRef.current.width = entry.contentRect.width
            if (ctx && font) {
                const [spec, pages] = font
                const leftChar = String.fromCodePoint(kernings[previewCounter % kernings.length]?.first ?? 0)
                const rightChar = String.fromCodePoint(kernings[previewCounter % kernings.length]?.second ?? 0)
                drawPreview(`${leftChar}${rightChar}`, spec, pages, scale, ctx)
            }
        }
    })

    return (
        <Card ref={canvasParentRef} style={{ backgroundColor: bgColor }}>
            <canvas ref={canvasRef} />
        </Card>
    )
}
