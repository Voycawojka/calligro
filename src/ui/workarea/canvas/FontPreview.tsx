import { Card, FormGroup, H4, InputGroup, TextArea } from "@blueprintjs/core"
import { ProjectData } from "../../../filesystem/projectstore"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { drawPreview } from "../../../generation/preview"
import { FontSpec, generateFont } from "../../../generation/font/Font"
import { calculateTemplateData, generateTemplateImage } from "../../../generation/template/template"
import useResizeObserver from "@react-hook/resize-observer"
import { useProjectState } from "../hooks/useProjectState"
import { useProjectStateNumericInput } from "../hooks/useProjectStateNumericInput"

export interface Props {
    project: ProjectData
}

export default function FontPreview({ project }: Props) {
    const [text, setText] = useProjectState("previewText", project)
    const [rawScale, setRawScale, scale] = useProjectStateNumericInput("previewScale", project)
    const [bgColor, setBgColor] = useProjectState("previewBgColor", project)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
    const [font, setFont] = useState<[FontSpec, Blob[]] | null>(null)

    const canvasParentRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (canvasRef.current) {
            setCtx(canvasRef.current.getContext("2d"))
        }
    }, [canvasRef.current])

    useEffect(() => {
        const generate = async () => {
            const templateData = calculateTemplateData(project, "current or imported")
            const templateImage = await generateTemplateImage(templateData)
            const font = await generateFont(templateData, templateImage)
            
            setFont(font)
        }
        generate()
    }, [project])

    useEffect(() => {
        if (ctx && font) {
            const draw = async () => {
                const [spec, pages] = font
                drawPreview(text, spec, pages, scale, ctx)
            }
            draw()
        }
    }, [text, scale, ctx, font])

    useResizeObserver(canvasParentRef, entry => {
        if (canvasRef.current) {
            canvasRef.current.width = entry.contentRect.width
            if (ctx && font) {
                const [spec, pages] = font
                drawPreview(text, spec, pages, scale, ctx)
            }
        }
    })

    const onTextChanged = (el: ChangeEvent<HTMLTextAreaElement>) => {
        setText(el.target.value)
    }

    return (
        <>
            <H4>Font Preview</H4>
            <TextArea value={text} onChange={onTextChanged} fill />
            <FormGroup label="Scale">
                <InputGroup type="number" leftIcon="zoom-in" min={1} value={rawScale} onValueChange={setRawScale} fill />
            </FormGroup>
            <FormGroup label="Background">
                {/* // TODO FIX THIS */}
                <InputGroup type="color" value={bgColor} leftIcon="color-fill" onValueChange={setBgColor} />
            </FormGroup>
            <Card ref={canvasParentRef} style={{ backgroundColor: bgColor }}>
                <canvas ref={canvasRef} />
            </Card>
        </>
    )
}
