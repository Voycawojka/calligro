import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core"
import { useEffect, useState } from "react"
import { ProjectData } from "../../../../filesystem/projectstore"
import { calculateTemplateData, generateTemplatePng } from "../../../../generation/template/template"
import ExportTemplateDialog from "../../../toolbar/dialogs/ExportTemplateDialog"

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
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [exportDialogOpen, setExportDialogOpen] = useState(false)

    useEffect(() => {
        const generate = async () => {
            const templateData = calculateTemplateData(project, "force current")
            const templateImage = await generateTemplatePng(templateData)

            setImageUrl(URL.createObjectURL(templateImage))
        }
        generate()
    }, [project])

    const onClose = () => {
        setIsOpen(false)
    }

    const onExport = () => {
        setExportDialogOpen(true)
        setIsOpen(false)
    }

    return (
        <>
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
                        <Button intent="primary" text="Export" onClick={onExport} />
                    </>
                } />
            </Dialog>

            <ExportTemplateDialog
                project={project}
                isOpen={exportDialogOpen} 
                setIsOpen={setExportDialogOpen}
            />
        </>
    )
}
