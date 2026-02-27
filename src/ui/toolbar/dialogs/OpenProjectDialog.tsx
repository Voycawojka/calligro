import { Button, Callout, Dialog, DialogBody, DialogFooter, MenuItem, OverlayToaster } from "@blueprintjs/core"
import { listProjectNames, loadProject } from "../../../filesystem/projectstore"
import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select"
import { useContext, useState } from "react"
import { ProjectContext, ProjectMutContext } from "../../contexts/ProjectContext"
import OverwriteChangesAlert from "./OverwriteChangesAlert"
import ExternalLink from "../../misc/externalLink/ExternalLink"
import { DesktopOnly } from "../../envSpecific/DesktopOnly"

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function OpenProjectDialog({ isOpen, setIsOpen }: Props) {
    const [selectedProject, setSelectedProject] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [overwriteAlertOpen, setOverwriteAlertOpen] = useState(false)
    const [overwriteAlertAcceptFunction, setOverwriteAlertAcceptFunction] = useState(() => () => {})

    const currentProject = useContext(ProjectContext)
    const { setProjectData } = useContext(ProjectMutContext)

    const projectNames = listProjectNames(undefined)
    
    const onClose = () => {
        setSelectedProject(null)
        setErrorMessage(null)
        setIsOpen(false)
    }

    const onLoad = async (force: boolean) => {
        try {
            if (!selectedProject) {
                throw new Error("No project chosen")
            }

            if (!force && currentProject && currentProject.dirty) {
                setOverwriteAlertAcceptFunction(() => () => onLoad(true))
                setOverwriteAlertOpen(true)
                return
            }

            const loadedProject = loadProject(selectedProject)
            if (!loadedProject) {
                throw new Error("Couldn't open the project")
            }

            setProjectData(loadedProject)
            onClose()
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                intent: "success",
                message: `Project '${selectedProject}' opened.`
            })
        } catch (e: any) {
            setErrorMessage((e as Error).message)
        }
    }

    const renderProject: ItemRenderer<string> = (name, { handleClick, handleFocus, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null
        }
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={name}
                onClick={handleClick}
                onFocus={handleFocus}
                roleStructure="listoption"
                text={name}
            />
        )
    }

    const projectPredicate: ItemPredicate<string> = (query, name, _index, exactMatch) => {
        const normalizedQuery = query.toLowerCase()
        const normalizedName = name.toLowerCase()

        if (exactMatch) {
            return normalizedQuery === normalizedName
        } else {
            return normalizedName.includes(normalizedQuery)
        }
    }

    return (
        <>
            <Dialog
                title="Open Project"
                icon="document-open"
                isOpen={isOpen}
                onClose={onClose}
            >
                <DialogBody>
                    <Select<string>
                        items={projectNames}
                        itemRenderer={renderProject}
                        itemPredicate={projectPredicate}
                        noResults={
                            <MenuItem disabled text="No projects found" roleStructure="listoption" />
                        }
                        onItemSelect={setSelectedProject}
                        popoverProps={{ minimal: true }}
                    >
                        <Button text={selectedProject ?? "Select a project"} endIcon="caret-down" />
                    </Select>
                    <DesktopOnly>
                        <br />
                        <Callout minimal intent="warning">
                            Projects from versions prior to 2.3.0 aren't available due to a significant change in the desktop app internals. To access those projects download <ExternalLink href="https://github.com/Voycawojka/calligro/releases/tag/v2.2.0">Calligro 2.2.0</ExternalLink>. 
                        </Callout>
                    </DesktopOnly>
                    { errorMessage && 
                        <Callout intent="danger">{errorMessage}</Callout>
                    }
                </DialogBody>
                <DialogFooter actions={
                    <>
                        <Button text="Cancel" onClick={onClose} />
                        <Button intent="primary" text="Open" onClick={() => onLoad(false)} />
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
