import { Dialog, DialogBody, InputGroup, Callout, DialogFooter, Button } from "@blueprintjs/core";
import { useContext, useState } from "react";
import { newProject } from "../../../filesystem/projectstore";
import { ProjectContext, ProjectLoadContext } from "../../ProjectContext";
import OverwriteChangesAlert from "./OverwriteChangesAlert";

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function NewProjectDialog({ isOpen, setIsOpen }: Props) {
    const [projectName, setProjectName] = useState("")
    const [errorMessage, setErrorMessage] = useState(null as string | null)
    const [overwriteAlertOpen, setOverwriteAlertOpen] = useState(false)
    const [overwriteAlertAcceptFunction, setOverwriteAlertAcceptFunction] = useState(() => () => {})

    const currentProject = useContext(ProjectContext)
    const setProjectContext = useContext(ProjectLoadContext)

    const onClose = () => {
        setProjectName("")
        setErrorMessage(null)
        setIsOpen(false)
    }

    const onCreate = (force: boolean) => {
        try {
            if (!force && currentProject && currentProject.dirty) {
                setOverwriteAlertAcceptFunction(() => () => onCreate(true))
                setOverwriteAlertOpen(true)
                return
            }

            if (projectName.trim() === "") {
                throw new Error("Name cannot be empty")
            }

            const project = newProject(projectName)
            setProjectContext(project)
            onClose()
        } catch (e: any) {
            setErrorMessage((e as Error).message)
        }
    }

    return (
        <>
            <Dialog
                title="New Project"
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
                        <Button intent="primary" text="Create!" onClick={() => onCreate(false)} />
                    </>
                } />
            </Dialog>

            <OverwriteChangesAlert 
                isOpen={overwriteAlertOpen}
                setIsOpen={setOverwriteAlertOpen}
                onAccepted={overwriteAlertAcceptFunction}
            />
        </>
    )
}
