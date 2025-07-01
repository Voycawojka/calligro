import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core"
import { useEffect, useState } from "react"
import { ProjectData } from "../../../filesystem/projectstore"
import { calculateTemplateData, generateTemplateImage } from "../../../generation/template/template"

export interface Props {
    project: ProjectData
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function PreviewTemplateDialog({
    project,
    isOpen,
    setIsOpen,
}: Props) {
    const [imageUrl, setImageUrl] = useState(null as string | null)

    useEffect(() => {
        const generate = async () => {
            const templateData = calculateTemplateData(project)
            const templateImage = await generateTemplateImage(templateData)

            setImageUrl(URL.createObjectURL(templateImage))
        }
        generate()
    }, [project])

    const onClose = () => {
        setIsOpen(false)
    }

    return (
        <Dialog
            title="Template Preview"
            icon="eye-open"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
                { imageUrl &&
                    <img src={imageUrl} />
                }
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button text="Close" onClick={onClose} />
                    {/* TODO export */}
                    <Button intent="primary" text="Export PNG" />
                </>
            } />
        </Dialog>
    )
}
