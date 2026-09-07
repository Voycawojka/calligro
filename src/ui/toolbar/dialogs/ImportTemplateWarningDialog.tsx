import { Dialog, DialogBody, DialogFooter, Button, Callout } from "@blueprintjs/core";
import { useContext } from "react";
import { ProjectContext, ProjectMutContext } from "../../contexts/ProjectContext"
import { importTemplateFile } from "../../../filesystem/templatestore";
import { asepriteToPng } from "../../../generation/png/aseprite";
import { showErrorToast, showSuccessToast } from "../../../utils/toasts";

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function ImportTemplateWarningDialog({ isOpen, setIsOpen }: Props) {
    const project = useContext(ProjectContext)
    const { setProjectData } = useContext(ProjectMutContext)

    const onClose = () => {
        setIsOpen(false)
    }

    const onImport = async () => {
        onClose()

        try {
            if (!project) {
                throw new Error("No project to import a template to")
            }

            const result = await importTemplateFile()

            if (result.status === "cancelled") {
                return
            }

            const templateFile = result.file
            const image = templateFile.image.type == "image/png" ? templateFile.image : await asepriteToPng(templateFile.image)
            const settings = project.lastExportSnapshot ?? project
            setProjectData({
                ...project,
                importedTemplate: {
                    defaultCharacterWidth: settings.defaultCharacterWidth,
                    defaultCharacterHeight: settings.defaultCharacterHeight,
                    characterBase: settings.characterBase,
                    characterSet: settings.characterSet,
                    image: image,
                    imageBase64: "",
                    fileHandle: templateFile.handle,
                },
                dirty: true,
            })

            const toasterMessage = !!templateFile.handle ? `Template '${templateFile.image.name}' imported.` : "Template imported."
            await showSuccessToast(toasterMessage)
        } catch (e: any) {
            await showErrorToast(e)
        }
    }

    return (
        <Dialog
            title="Import Template"
            icon="import"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
               <Callout minimal>
                    { !!project?.lastExportSnapshot
                        ? "The importer will use the template settings as they were the last time a template was exported. Make sure to import a compatible template."
                        : "A template was never exported from this project so the importer will use the current template settings. Make sure to import a compatible template."
                    }
               </Callout>
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button text="Cancel" onClick={onClose} />
                    <Button intent="primary" text="Import" onClick={onImport} />
                </>
            } />
        </Dialog>
    )
}
