import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select";
import { KerningPair, ProjectData } from "../../../filesystem/projectstore";
import { Button, ButtonGroup, FormGroup, InputGroup, MenuItem, Tag, Tooltip } from "@blueprintjs/core";
import { useContext, useState } from "react";
import AddKerningDialog from "./dialogs/AddKerningDialog";
import KerningPreview from "../canvas/KerningPreview";
import { ProjectLoadContext } from "../../contexts/ProjectContext";

export interface Props {
    project: ProjectData
}

export default function KerningPairsInput({ project }: Props) {
    const [editedKerning, setEditedKerning] = useState<KerningPair | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const setProjectContext = useContext(ProjectLoadContext)

    const str = (kerning: KerningPair) => `${String.fromCharCode(kerning.first)}${String.fromCharCode(kerning.second)}`

    const renderKerning: ItemRenderer<KerningPair> = (kerning, { handleClick, handleFocus, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null
        }
        
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={`${str(kerning)}}`}
                onClick={handleClick}
                onFocus={handleFocus}
                roleStructure="listoption"
                text={`${str(kerning)}`}
                label={kerning.amount.toString()}
            />
        )
    }

    const kerningPredicate: ItemPredicate<KerningPair> = (query, kerning, _index, exactMatch) => {
        const normalizedKerning = str(kerning)

        if (exactMatch) {
            return query === normalizedKerning
        } else {
            return normalizedKerning.includes(query)
        }
    }

    const onAmountChanged = (value: string) => {
        const val = Number(value)
        if (!isNaN(val) && editedKerning) {
            editedKerning.amount = val
            setProjectContext({...project})
        }
    }

    const removeKerning = () => {
        const updatedProject = { ...project }
        updatedProject.kernings = updatedProject.kernings.filter(kerning => kerning !== editedKerning)
        setProjectContext(updatedProject)
        setEditedKerning(null)
    }

    return (
        <>
            <FormGroup label="Kerning pairs">
                <InputGroup
                    value={editedKerning?.amount?.toString() ?? ""}
                    onValueChange={onAmountChanged}
                    type="number"
                    leftElement={
                        <ButtonGroup>
                            <Tooltip content="Add kerning">
                                <Button icon="add" onClick={() => setDialogOpen(true)} />
                            </Tooltip>
                            <Select<KerningPair>
                                items={project.kernings}
                                itemRenderer={renderKerning}
                                itemPredicate={kerningPredicate}
                                noResults={
                                    <MenuItem disabled text="No kernings defined yet" roleStructure="listoption" />
                                }
                                onItemSelect={setEditedKerning}
                                popoverProps={{ minimal: true }}
                            >
                                <Button icon="caret-down" text={editedKerning && str(editedKerning)} />
                            </Select>
                        </ButtonGroup>
                    }
                    rightElement={
                        <>
                            <Tag minimal>px</Tag>
                            <Tooltip content="Remove kerning">
                                <Button icon="remove" disabled={!editedKerning} onClick={removeKerning} />
                            </Tooltip>
                        </>
                    }
                />
            </FormGroup>
            { editedKerning &&
                <KerningPreview project={project} kerning={editedKerning} />
            }

            <AddKerningDialog
                project={project}
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
            />
        </>
    )
}
