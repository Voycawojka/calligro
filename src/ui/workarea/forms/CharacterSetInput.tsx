import { Button, FormGroup } from "@blueprintjs/core"
import { useState } from "react"
import CharacterSetDialog from "./dialogs/CharacterSetDialog"
import { ProjectData } from "../../../filesystem/projectstore"
import { useProjectState } from "../hooks/useProjectState"

export interface Props {
    project: ProjectData
}

export default function CharacterSetInput({ project }: Props) {
    const [characters, setCharacters] = useProjectState("characterSet", project)
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <FormGroup label="Character set">
                <Button
                    icon="edit"
                    text={`${characters.length} characters`}
                    onClick={() => setDialogOpen(true)}
                />
            </FormGroup>

            <CharacterSetDialog
                isOpen={dialogOpen}
                acceptedCharacters={characters}
                setIsOpen={setDialogOpen}
                setAcceptedCharacters={setCharacters}
            />
        </>
    )
}
