import { OverlayToaster, MenuItem, Button, ControlGroup, Tooltip, FormGroup, Callout } from "@blueprintjs/core"
import { ItemRenderer, ItemPredicate, Select } from "@blueprintjs/select"
import { useState, useEffect } from "react"
import { findSystemFonts } from "../../../generation/template/fontsDetection"
import { ProjectData } from "../../../filesystem/projectstore"
import { useProjectState } from "../hooks/useProjectState"

export interface Props {
    project: ProjectData
    forceDisabled: boolean
}

export default function PrefillInput({ project, forceDisabled }: Props) {
    const [prefill, setPrefill] = useProjectState("prefill", project)
    const [systemFonts, setSystemFonts] = useState<string[]>([])

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

    const renderPrefill: ItemRenderer<string> = (name, { handleClick, handleFocus, modifiers }) => {
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
        <FormGroup label="Pre-fill" disabled={forceDisabled}>
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
                    disabled={forceDisabled}
                >
                    <Tooltip content="Base for drawing on the template" compact>
                        <Button icon="font" text={prefill ?? "blank"} endIcon="caret-down" disabled={forceDisabled} />
                    </Tooltip>
                </Select>
                { prefill &&
                    <Tooltip content="Remove prefill" compact>
                        <Button endIcon="remove" onClick={() => setPrefill(null)} disabled={forceDisabled} />
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
