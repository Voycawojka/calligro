import { Dialog, DialogBody, DialogFooter, Button, OverlayToaster, Callout } from "@blueprintjs/core";
import { useContext } from "react";
import { ProjectContext, ProjectLoadContext } from "../../contexts/ProjectContext"
import { importTemplateFile } from "../../../filesystem/templatestore";
import { asepriteToPng } from "../../../generation/png/aseprite";

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function ImportTemplateWarningDialog({ isOpen, setIsOpen }: Props) {
    const project = useContext(ProjectContext)
    const setProjectContext = useContext(ProjectLoadContext)

    const onClose = () => {
        setIsOpen(false)
    }

    const onImport = async () => {
        onClose()

        try {
            if (!project) {
                throw new Error("No project to import a template to")
            }

            const templateFile = await importTemplateFile()

            if (!templateFile) {
                throw new Error("Something went wrong reading the template file")
            }

            const image = templateFile.image.type == "image/png" ? templateFile.image : await asepriteToPng(templateFile.image)
            const settings = project.lastExportSnapshot ?? project
            setProjectContext({
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

            const toaster = await OverlayToaster.create({ position: "top-right" })
            const toasterMessage = !!templateFile.handle ? `Template '${templateFile.handle.name}' imported.` : "Template imported."
            toaster.show({
                intent: "success",
                message: toasterMessage,
            })
        } catch (e: any) {
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "error",
                intent: "danger",
                message: (e as Error).message
            })
            console.error(e)
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
