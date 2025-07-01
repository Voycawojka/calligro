import { Card, FormGroup, H4, NumericInput, TextArea } from "@blueprintjs/core"
import { ProjectData } from "../../../filesystem/projectstore"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { drawPreview } from "../../../preview/preview"
import { FontSpec, generateFont } from "../../../generation/font/Font"
import { calculateTemplateData, generateTemplateImage } from "../../../generation/template/template"

export interface Props {
    project: ProjectData
}

export default function FontPreview({ project }: Props) {
    const [text, setText] = useState("Just a sample text")
    const [scale, setScale] = useState(1)
    const [ctx, setCtx] = useState(null as CanvasRenderingContext2D | null)
    const [font, setFont] = useState(null as [FontSpec, Blob[]] | null)

    const canvasRef = useRef(null as HTMLCanvasElement | null)

    useEffect(() => {
        if (canvasRef.current) {
            setCtx(canvasRef.current.getContext("2d"))
        }
    }, [canvasRef.current])

    useEffect(() => {
        const generate = async () => {
            const templateData = calculateTemplateData(project)
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

    const onTextChanged = (el: ChangeEvent<HTMLTextAreaElement>) => {
        setText(el.target.value)
    }

    return (
        <>
            <H4>Font Preview</H4>
            <TextArea value={text} onChange={onTextChanged} fill />
            <FormGroup label="Scale">
                <NumericInput leftIcon="zoom-in" min={1} value={scale} onValueChange={setScale} clampValueOnBlur fill />
            </FormGroup>
            <Card>
                <canvas ref={canvasRef} />
            </Card>
        </>
    )
}
