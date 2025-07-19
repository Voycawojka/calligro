import { Button, Callout, Dialog, DialogBody, DialogFooter, MenuItem, OverlayToaster } from "@blueprintjs/core"
import { listProjectNames, removeProject } from "../../../filesystem/projectstore"
import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select"
import { useState } from "react"

export interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function RemoveProjectDialog({ isOpen, setIsOpen }: Props) {
    const [selectedProject, setSelectedProject] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const projectNames = listProjectNames(undefined)

    const onClose = () => {
        setSelectedProject(null)
        setErrorMessage(null)
        setIsOpen(false)
    }

    const onRemove = async () => {
        try {
            if (!selectedProject) {
                throw new Error("No project chosen")
            }
            removeProject(selectedProject)
            setSelectedProject(null)
            onClose()
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                intent: "success",
                message: `Removed project '${selectedProject}'`
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
                key={name}
                onClick={handleClick}
                onFocus={handleFocus}
                text={name}
            />
        )
    }

    const filterProject: ItemPredicate<string> = (query, name, _index, exactMatch) => {
        const normalizedQuery = query.toLowerCase()
        const normalizedName = name.toLowerCase()

        if (exactMatch) {
            return normalizedQuery === normalizedName
        } else {
            return normalizedName.includes(normalizedQuery)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Remove Project">
            <DialogBody>
                <Callout intent="warning">
                    This will permanently delete the selected project from your device.
                    This action cannot be undone.
                    <br />
                    <br />
                    It will not delete any templates that were exported from this project.
                </Callout>
                <Select
                    items={projectNames}
                    itemRenderer={renderProject}
                    itemPredicate={filterProject}
                    noResults={<MenuItem disabled text="No projects found" />}
                    onItemSelect={setSelectedProject}
                    popoverProps={{ minimal: true }}
                >
                    <Button text={selectedProject ?? "Select a project"} endIcon="caret-down" />
                </Select>
                {errorMessage && <Callout intent="danger">{errorMessage}</Callout>}
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button intent="danger" onClick={onRemove} disabled={!selectedProject}>Remove</Button>
                </>
            } />
        </Dialog>
    )
}
