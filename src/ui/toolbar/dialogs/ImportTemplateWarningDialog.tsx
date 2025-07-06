import { Dialog, DialogBody, DialogFooter, Button, OverlayToaster, Callout } from "@blueprintjs/core";
import { useContext } from "react";
import { ProjectContext, ProjectLoadContext } from "../../ProjectContext"
import { importTemplate } from "../../../filesystem/templatestore";

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

            const image = await importTemplate()

            if (!image) {
                throw new Error("Something went wrong reading the template file")
            }

            const settings = project.lastExportSnapshot ?? project
            setProjectContext({
                ...project,
                importedTemplate: {
                    defaultCharacterWidth: settings.defaultCharacterWidth,
                    defaultCharacterHeight: settings.defaultCharacterHeight,
                    characterBase: settings.characterBase,
                    characterSet: settings.characterSet,
                    image: image,
                },
                dirty: true,
            })
        } catch (e: any) {
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "error",
                intent: "danger",
                message: (e as Error).message
            })
        }
    }

    return (
        <Dialog
            title="Import Template PNG"
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
