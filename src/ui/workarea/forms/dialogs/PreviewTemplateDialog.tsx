import { Button, Dialog, DialogBody, DialogFooter } from "@blueprintjs/core"
import { useContext, useEffect, useState } from "react"
import { ProjectData } from "../../../../filesystem/projectstore"
import { calculateTemplateData, generateTemplateImage } from "../../../../generation/template/template"
import { exportTemplate } from "../../../../filesystem/templatestore"
import { ProjectLoadContext } from "../../../contexts/ProjectContext"

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

    const setProjectContext = useContext(ProjectLoadContext)

    useEffect(() => {
        const generate = async () => {
            const templateData = calculateTemplateData(project, "force current")
            const templateImage = await generateTemplateImage(templateData)

            setImageUrl(URL.createObjectURL(templateImage))
        }
        generate()
    }, [project])

    const onClose = () => {
        setIsOpen(false)
    }

    const onExport = () => {
        exportTemplate(project)
        setProjectContext({
            ...project,
            lastExportSnapshot: {
                defaultCharacterWidth: project.defaultCharacterWidth,
                defaultCharacterHeight: project.defaultCharacterHeight,
                characterBase: project.characterBase,
                characterSet: project.characterSet,
            },
            dirty: true,
        })
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
                    <Button intent="primary" text="Export PNG" onClick={onExport} />
                </>
            } />
        </Dialog>
    )
}
