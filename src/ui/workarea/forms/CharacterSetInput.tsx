import { Button, FormGroup } from "@blueprintjs/core"
import { useContext, useEffect, useState } from "react"
import CharacterSetDialog from "./CharacterSetDialog"
import { ProjectData } from "../../../filesystem/projectstore"
import { ProjectLoadContext } from "../../ProjectContext"

export interface Props {
    project: ProjectData
}

export default function CharacterSetInput({ project }: Props) {
    const setProjectContext = useContext(ProjectLoadContext)

    const [characters, setCharacters] = useState(project.characterSet)
    const [dialogOpen, setDialogOpen] = useState(false)

    useEffect(() => {
        if (characters !== project.characterSet) {
            setProjectContext({
                ...project,
                characterSet: characters,
                dirty: true
            })
        }
    }, [characters])

    useEffect(() => {
        setCharacters(project.characterSet)
    }, [project.characterSet])

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
