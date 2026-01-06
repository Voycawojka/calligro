import { Button, Callout, Dialog, DialogBody, DialogFooter, Radio, RadioGroup } from "@blueprintjs/core"
import { FormEvent, useContext, useEffect, useState } from "react"
import { ProjectData } from "../../../filesystem/projectstore"
import { exportTemplate } from "../../../filesystem/templatestore"
import { ProjectLoadContext } from "../../contexts/ProjectContext"

export interface Props {
    project: ProjectData
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function ExportTemplateDialog({
    project,
    isOpen,
    setIsOpen,
}: Props) {
    const [format, setFormat] = useState(project.lastExportSnapshot?.format ?? "png")
    const setProjectContext = useContext(ProjectLoadContext)

    useEffect(() => {
        setFormat(project.lastExportSnapshot?.format ?? "png")
    }, [isOpen])

    const onClose = () => {
        setIsOpen(false)
    }

    const onFormatChange = (e: FormEvent<HTMLInputElement>) => {
        setFormat(e.currentTarget.value as "png" | "aseprite")
    }

    const onExport = () => {
        exportTemplate(project, format)
        setProjectContext({
            ...project,
            lastExportSnapshot: {
                defaultCharacterWidth: project.defaultCharacterWidth,
                defaultCharacterHeight: project.defaultCharacterHeight,
                characterBase: project.characterBase,
                characterSet: project.characterSet,
                format: format,
            },
            dirty: true,
        })
        setIsOpen(false)
    }

    return (
        <Dialog
            title="Template Export"
            icon="export"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
                <Callout icon="info-sign">
                    Aseprite templates come with some predefined layers for convenience.
                </Callout>
                <br />
                <RadioGroup label="Template format:" onChange={onFormatChange} selectedValue={format}>
                    <Radio label="PNG" value="png" />
                    <Radio label="Aseprite" value="aseprite" />
                </RadioGroup>
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button text="Close" onClick={onClose} />
                    <Button intent="primary" text="Export" onClick={onExport} />
                </>
            } />
        </Dialog>
    )
}
