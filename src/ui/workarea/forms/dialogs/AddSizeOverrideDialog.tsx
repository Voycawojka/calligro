import { Button, Callout, Dialog, DialogBody, DialogFooter, FormGroup, InputGroup, OverlayToaster, TextArea } from "@blueprintjs/core"
import { ProjectData } from "../../../../filesystem/projectstore"
import { useContext, useState } from "react"
import { ProjectLoadContext } from "../../../contexts/ProjectContext"

export interface Props {
    project: ProjectData
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function AddSizeOverrideDialog({
    project,
    isOpen,
    setIsOpen,
}: Props) {
    const [characters, setCharacters] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const setProjectContext = useContext(ProjectLoadContext)

    const onClose = () => {
        setIsOpen(false)
        setErrorMessage(null)
        setCharacters("")
    }

    const onAdd = async () => {
        try {
            if (characters.length === 0) {
                throw new Error("No characters are specified")
            }

            const updatedProject = { ...project, dirty: true }
            let addedCount = 0

            for (let i = 0; i < characters.length; i++) {
                // TODO ignore duplicates
                // TODO ignore characters not in the character set
                updatedProject.sizeOverrides.push({
                    char: characters.charCodeAt(i),
                    width: updatedProject.defaultCharacterWidth,
                    height: updatedProject.defaultCharacterHeight,
                })
                addedCount++
            }

            setProjectContext(updatedProject)
            onClose()

            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "add",
                intent: "success",
                message: `Added ${addedCount} size overrides`
            })
        } catch (e: any) {
            setErrorMessage((e as Error).message)
        }
    }

    return (
        <Dialog
            title="Add Size Overrides"
            icon="arrows-horizontal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
                <Callout>
                    Specify characters for which you want to define a non-default size.
                    Duplicates and characters not defined in the character set will be ignored.
                </Callout>
                <br />
                <TextArea
                    fill
                    value={characters}
                    onChange={e => setCharacters(e.target.value)}
                    rows={5}
                    spellCheck={false}
                />
                { errorMessage &&
                    <Callout intent="danger">
                        {errorMessage}
                    </Callout>
                }
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button text="Cancel" onClick={onClose} />
                    <Button intent="primary" text={`Add all`} onClick={onAdd} />
                </>
            } />
        </Dialog>
    )
}
