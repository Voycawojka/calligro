import { Card, FormGroup, H4, InputGroup, NumericInput, TextArea } from "@blueprintjs/core"
import { ProjectData } from "../../../filesystem/projectstore"
import { ChangeEvent, ReactEventHandler, useEffect, useRef, useState } from "react"
import { drawPreview } from "../../../preview/preview"
import { FontSpec, generateFont } from "../../../generation/font/Font"
import { calculateTemplateData, generateTemplateImage } from "../../../generation/template/template"
import useResizeObserver from "@react-hook/resize-observer"

export interface Props {
    project: ProjectData
}

export default function FontPreview({ project }: Props) {
    const [text, setText] = useState("Just a sample text")
    const [scale, setScale] = useState(1)
    const [ctx, setCtx] = useState(null as CanvasRenderingContext2D | null)
    const [font, setFont] = useState(null as [FontSpec, Blob[]] | null)

    const canvasParentRef = useRef(null as HTMLDivElement | null)
    const canvasRef = useRef(null as HTMLCanvasElement | null)

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

    const onBgChanged = (el: ChangeEvent<HTMLInputElement>) => {
        if (canvasParentRef.current) {
            const color = el.target.value
            canvasParentRef.current.style.background = color
        }
    }

    return (
        <>
            <H4>Font Preview</H4>
            <TextArea value={text} onChange={onTextChanged} fill />
            <FormGroup label="Scale">
                <NumericInput leftIcon="zoom-in" min={1} value={scale} onValueChange={setScale} clampValueOnBlur fill />
            </FormGroup>
            <FormGroup label="Background">
                <InputGroup type="color" leftIcon="color-fill" onChange={onBgChanged} />
            </FormGroup>
            <Card ref={canvasParentRef}>
                <canvas ref={canvasRef} />
            </Card>
        </>
    )
}
