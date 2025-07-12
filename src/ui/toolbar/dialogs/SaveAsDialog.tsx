import { Dialog, DialogBody, InputGroup, Callout, DialogFooter, Button } from "@blueprintjs/core";
import { useContext, useState } from "react";
import { listProjectNames, saveProject } from "../../../filesystem/projectstore";
import { ProjectContext, ProjectLoadContext } from "../../contexts/ProjectContext";

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function SaveAsDialog({ isOpen, setIsOpen }: Props) {
    const [projectName, setProjectName] = useState("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const currentProject = useContext(ProjectContext)
    const setProjectContext = useContext(ProjectLoadContext)

    const onClose = () => {
        setProjectName("")
        setErrorMessage(null)
        setIsOpen(false)
    }

    const onSave = () => {
        try {
            if (!currentProject) {
                throw new Error("No project to save")
            }

            if (projectName.trim() === "") {
                throw new Error("Name cannot be empty")
            }

            if (listProjectNames(undefined).includes(projectName)) {
                throw new Error("Project with this name already exists")
            }

            const copiedProject = {
                ...currentProject,
                name: projectName,
                dirty: false,
            }

            saveProject(projectName, copiedProject)
            setProjectContext(copiedProject)
            onClose()
        } catch (e: any) {
            setErrorMessage((e as Error).message)
        }
    }

    return (
        <Dialog
            title="Save Project As..."
            icon="new-object"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
                <InputGroup id="new-project-name" placeholder="Project Name" value={projectName} onValueChange={setProjectName} />
                { errorMessage && 
                    <Callout intent="danger">{errorMessage}</Callout>
                }
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button text="Cancel" onClick={onClose} />
                    <Button intent="primary" text="Save" onClick={onSave} />
                </>
            } />
        </Dialog>
    )
}
