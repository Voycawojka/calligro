import { OverlayToaster, MenuItem, Button, ControlGroup, Tooltip, FormGroup, Callout } from "@blueprintjs/core"
import { ItemRenderer, ItemPredicate, Select } from "@blueprintjs/select"
import { useState, useEffect, useContext } from "react"
import { findSystemFonts } from "../../../generation/template/fontsDetection"
import { ProjectData } from "../../../filesystem/projectstore"
import { ProjectLoadContext } from "../../ProjectContext"

export interface Props {
    project: ProjectData
}

export default function PrefillInput({ project }: Props) {
    const setProjectContext = useContext(ProjectLoadContext)

    const [prefill, setPrefill] = useState(project.prefill)
    const [systemFonts, setSystemFonts] = useState([] as string[])

    useEffect(() => {
        const findFonts = async () => {
            try {
                setSystemFonts(await findSystemFonts())
            } catch (e: any) {
                const toaster = await OverlayToaster.create({ position: "top-right" })
                toaster.show({
                    icon: "error",
                    intent: "danger",
                    message: `Couldn't load pre-fill font list: ${(e as Error).message}`
                })
            }
        }
        findFonts()
    }, [])

    useEffect(() => {
        if (prefill !== project.prefill) {
            setProjectContext({
                ...project,
                prefill,
                dirty: true,
            })
        }
    }, [prefill])

    useEffect(() => {
        setPrefill(project.prefill)
    }, [project.prefill])

    const renderPrefill: ItemRenderer<string> = (name, { handleClick, handleFocus, modifiers, query}) => {
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
                label="ABC abc"
                style={{ fontFamily: name }}
            />
        )
    }

    const prefillPredicate: ItemPredicate<string> = (query, name, _index, exactMatch) => {
        const normalizedQuery = query.toLowerCase()
        const normalizedName = name.toLowerCase()

        if (exactMatch) {
            return normalizedQuery === normalizedName
        } else {
            return normalizedName.includes(normalizedQuery)
        }
    }

    return (
        <FormGroup label="Pre-fill">
            <ControlGroup>
                <Select<string>
                    items={systemFonts}
                    itemRenderer={renderPrefill}
                    itemPredicate={prefillPredicate}
                    noResults={
                        <MenuItem disabled text="No fonts found" roleStructure="listoption" />
                    }
                    onItemSelect={setPrefill}
                    popoverProps={{ minimal: true }}
                >
                    <Tooltip content="Base for drawing on the template" compact>
                        <Button icon="font" text={prefill ?? "blank"} endIcon="caret-down" />
                    </Tooltip>
                </Select>
                { prefill &&
                    <Tooltip content="Remove prefill" compact>
                        <Button endIcon="remove" onClick={() => setPrefill(null)} />
                    </Tooltip>
                }
            </ControlGroup>
            { prefill &&
                <Callout icon="info-sign">
                    Be mindful of the font's license.
                </Callout>
            }
        </FormGroup>
    )
}
