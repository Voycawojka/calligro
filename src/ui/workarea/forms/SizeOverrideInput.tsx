import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select";
import { ProjectData, SizeOverride } from "../../../filesystem/projectstore";
import { Button, ButtonGroup, FormGroup, InputGroup, MenuItem, Tag, Tooltip } from "@blueprintjs/core";
import { useContext, useState } from "react";
import { ProjectLoadContext } from "../../contexts/ProjectContext";
import AddSizeOverrideDialog from "./dialogs/AddSizeOverrideDialog";

export interface Props {
    project: ProjectData
    forceDisabled: boolean
}

export default function SizeOverrideInput({ project, forceDisabled }: Props) {
    const [editedOverride, setEditedOverride] = useState<SizeOverride | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const setProjectContext = useContext(ProjectLoadContext)

    const str = (override: SizeOverride) => String.fromCharCode(override.char)

    const renderOverride: ItemRenderer<SizeOverride> = (override, { handleClick, handleFocus, modifiers }) => {
        if (!modifiers.matchesPredicate) {
            return null
        }
        
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={`${str(override)}}`}
                onClick={handleClick}
                onFocus={handleFocus}
                roleStructure="listoption"
                text={str(override)}
                label={`${override.width} x ${override.height}`}
            />
        )
    }

    const overridePredicate: ItemPredicate<SizeOverride> = (query, override, _index, exactMatch) => {
        const normalizedOverride = `${str(override)} ${override.width} x ${override.height}`

        if (exactMatch) {
            return query === normalizedOverride
        } else {
            return normalizedOverride.includes(query)
        }
    }

    const onWidthChanged = (value: string) => {
        const val = Number(value)
        if (!isNaN(val) && editedOverride) {
            editedOverride.width = val
            setProjectContext({...project})
        }
    }

    const onHeightChanged = (value: string) => {
        const val = Number(value)
        if (!isNaN(val) && editedOverride) {
            editedOverride.height = val
            setProjectContext({...project})
        }
    }

    const removeOverride = () => {
        const updatedProject = { ...project }
        updatedProject.sizeOverrides = updatedProject.sizeOverrides.filter(override => override !== editedOverride)
        setProjectContext(updatedProject)
        setEditedOverride(null)
    }

    return (
        <>
            <FormGroup label="Size overrides" disabled={forceDisabled}>
                <ButtonGroup>
                    <Tooltip content="Add size override">
                        <Button icon="add" onClick={() => setDialogOpen(true)} disabled={forceDisabled} />
                    </Tooltip>
                    <Select<SizeOverride>
                        items={project.sizeOverrides}
                        itemRenderer={renderOverride}
                        itemPredicate={overridePredicate}
                        noResults={
                            <MenuItem disabled text="No size overrides defined yet" roleStructure="listoption" />
                        }
                        onItemSelect={setEditedOverride}
                        popoverProps={{ minimal: true }}
                        disabled={forceDisabled}
                    >
                        <Button icon="caret-down" text={editedOverride && str(editedOverride)} disabled={forceDisabled} />
                    </Select>
                    <Tooltip content="Remove size override">
                        <Button icon="remove" disabled={!editedOverride || forceDisabled} onClick={removeOverride} />
                    </Tooltip>
                </ButtonGroup>
            </FormGroup>
            
            { editedOverride &&
                <>
                    {/* TODO force disable labels too */}
                    <FormGroup label={`Width override (${str(editedOverride)})`}>
                        <InputGroup
                            type="number"
                            value={editedOverride.width.toString()}
                            onValueChange={onWidthChanged}
                            rightElement={<Tag minimal>px</Tag>}
                            size="small"
                            min={1}
                            disabled={forceDisabled}
                        />
                    </FormGroup>
                    <FormGroup label={`Height override (${str(editedOverride)})`}>
                        <InputGroup
                            type="number"
                            value={editedOverride.height.toString()}
                            onValueChange={onHeightChanged}
                            rightElement={<Tag minimal>px</Tag>}
                            size="small"
                            min={1}
                            disabled={forceDisabled}
                        />
                    </FormGroup>
                </>
            }
            

            <AddSizeOverrideDialog
                project={project}
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
            />
        </>
    )
}
