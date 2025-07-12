import { Button, Callout, ControlGroup, Dialog, DialogBody, DialogFooter, Divider, FormGroup, InputGroup } from "@blueprintjs/core"
import { ProjectData } from "../../../../filesystem/projectstore"
import KerningPreview from "../../canvas/KerningPreview"
import { useContext, useState } from "react"
import { ProjectLoadContext } from "../../../contexts/ProjectContext"

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
    const [left, setLeft] = useState<number | null>(null)
    const [right, setRight] = useState<number | null>(null)
    const [amount, setAmount] = useState("0")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const setProjectContext = useContext(ProjectLoadContext)

    const onClose = () => {
        setIsOpen(false)
        setErrorMessage(null)
        setLeft(null)
        setRight(null)
        setAmount("0")
    }

    const onAdd = () => {
        try {
            if (!left || !right) {
                throw new Error("Characters aren't specified")
            }

            project.kernings.forEach(kerning => {
                if (kerning.first === left && kerning.second === right) {
                    throw new Error("Kerning pair already exists")
                }
            })

            const updatedProject = { ...project, dirty: true }
            updatedProject.kernings.push({
                first: left,
                second: right,
                amount: Number(amount),
            })
            setProjectContext(updatedProject)
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
                <Callout>
                    Overwrites how much closer or further apart should two characters be when next to each other.
                </Callout>
                <br />
                <FormGroup label="Left character">
                    <InputGroup
                        value={left === null ? "" : String.fromCharCode(left)}
                        onValueChange={value => setLeft(value.charCodeAt(value.length-1))}
                    />
                </FormGroup>
                <FormGroup label="Right character">
                    <InputGroup
                         value={right === null ? "" : String.fromCharCode(right)}
                         onValueChange={value => setRight(value.charCodeAt(value.length-1))}
                    />
                </FormGroup>
                <FormGroup label="Amount">
                    <InputGroup
                        value={amount.toString()}
                        onValueChange={setAmount}
                        type="number"
                    />
                </FormGroup>
                <KerningPreview project={project} kerning={{
                    first: left ?? 0,
                    second: right ?? 0,
                    amount: Number(amount),
                }} />
                { ((left !== null && !project.characterSet.includes(String.fromCharCode(left)))
                    || (right !== null && !project.characterSet.includes(String.fromCharCode(right)))) &&
                    <Callout intent="warning">
                        At least one character is not in the current character set
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
                    <Button intent="primary" text="Add" onClick={onAdd} />
                </>
            } />
        </Dialog>
    )
}
