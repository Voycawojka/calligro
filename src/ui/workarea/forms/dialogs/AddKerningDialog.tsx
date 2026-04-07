import { Button, Callout, Dialog, DialogBody, DialogFooter, FormGroup, InputGroup } from "@blueprintjs/core"
import { KerningPair, ProjectData } from "../../../../filesystem/projectstore"
import KerningPreview from "../../canvas/KerningPreview"
import { useContext, useState } from "react"
import { ProjectMutContext } from "../../../contexts/ProjectContext"

export interface Props {
    project: ProjectData
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function AddKerningDialog({
    project,
    isOpen,
    setIsOpen,
}: Props) {
    const [left, setLeft] = useState<string | null>(null)
    const [right, setRight] = useState<string | null>(null)
    const [amount, setAmount] = useState("0")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const { setProjectData } = useContext(ProjectMutContext)

    const onClose = () => {
        setIsOpen(false)
        setErrorMessage(null)
        setLeft(null)
        setRight(null)
        setAmount("0")
    }
    
    const willOverwrite = project.kernings.some(kerning => left?.includes(String.fromCodePoint(kerning.first)) && right?.includes(String.fromCodePoint(kerning.second)))
    const permutations: KerningPair[] = [...(left ?? String.fromCodePoint(0))]
        .flatMap(leftChar => [...(right ?? String.fromCodePoint(0))]
            .map(rightChar => ({
                first: leftChar.codePointAt(0) ?? 0,
                second: rightChar.codePointAt(0) ?? 0,
                amount: Number(amount),
            } satisfies KerningPair))
        )
    const uniquePermutations = permutations.filter((perm, index, self) =>index === self.findIndex(p => p.first === perm.first && p.second === perm.second))
    const invalidChar = left && [...left].find(char => !project.characterSet.includes(char))
        || right && [...right].find(char => !project.characterSet.includes(char))

    const onAdd = () => {
        try {
            if (!left || !right) {
                throw new Error("Characters aren't specified")
            }

            const updatedProject = { ...project, dirty: true }
            updatedProject.kernings = updatedProject.kernings.filter(kerning => !uniquePermutations.some(k => k.first === kerning.first && k.second === kerning.second))
            updatedProject.kernings.push(...uniquePermutations)
            setProjectData(updatedProject)
            onClose()
        } catch (e: any) {
            setErrorMessage((e as Error).message)
        }
    }

    return (
        <Dialog
            title="Add Kerning Pair"
            icon="arrows-horizontal"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
                <Callout icon="info-sign">
                    Input multiple characters to create all permutations of kerning pairs
                </Callout>
                <br />
                <FormGroup label="Left characters">
                    <InputGroup
                        value={left ?? ""}
                        onValueChange={value => setLeft(value)}
                    />
                </FormGroup>
                <FormGroup label="Right characters">
                    <InputGroup
                         value={right ?? ""}
                         onValueChange={value => setRight(value)}
                    />
                </FormGroup>
                <FormGroup label="Amount">
                    <InputGroup
                        value={amount.toString()}
                        onValueChange={setAmount}
                        type="number"
                    />
                </FormGroup>
                <KerningPreview project={project} kernings={permutations} />
                { invalidChar &&
                    <Callout intent="danger">
                        Character '<strong>{invalidChar}</strong>' is not in the character set
                    </Callout>
                }
                { willOverwrite &&
                    <Callout intent="warning">
                        One or more existing kerning pairs will be overwritten
                    </Callout>
                }
                { uniquePermutations.length !== permutations.length &&
                    <Callout intent="warning">
                        Some permutations are duplicates and will be ignored ({permutations.length - uniquePermutations.length} duplicates)
                    </Callout>
                }
                { errorMessage &&
                    <Callout intent="danger">
                        {errorMessage}
                    </Callout>
                }
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button text="Cancel" onClick={onClose} />
                    <Button
                        intent="primary"
                        text={`Add ${uniquePermutations.length} Pair${uniquePermutations.length !== 1 ? "s" : ""}`} 
                        onClick={onAdd} 
                        disabled={!left || !right || !!invalidChar}
                    />
                </>
            } />
        </Dialog>
    )
}
