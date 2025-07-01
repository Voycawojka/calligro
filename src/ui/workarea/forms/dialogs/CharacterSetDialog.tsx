import { Button, ButtonGroup, Callout, Dialog, DialogBody, DialogFooter, Icon, MenuItem, TextArea, Tooltip } from "@blueprintjs/core"
import { ItemPredicate, ItemRenderer, Select } from "@blueprintjs/select"
import { ChangeEvent, useEffect, useState } from "react"
import { UnicodeRange } from "unicode-range-json"
import { getUnicodeRangeChars, getUnicodeRanges } from "../../../../utils/unicodeRanges"

export interface Props {
    isOpen: boolean
    acceptedCharacters: string
    setIsOpen: (open: boolean) => void
    setAcceptedCharacters: (characters: string) => void
}

export default function CharacterSetDialog({
    isOpen,
    acceptedCharacters,
    setIsOpen,
    setAcceptedCharacters
}: Props) {
    const [characters, setCharacters] = useState(acceptedCharacters)
    const [unicodeRanges, setUnicodeRanges] = useState([] as UnicodeRange[])
    const [hasDuplicates, setHasDuplicates] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null as string | null)

    useEffect(() => {
        setUnicodeRanges(getUnicodeRanges())
    }, [])

    const removeDuplicates = () => {
        const deduplicated = [...new Set(characters.split(''))].join('')
        setCharacters(deduplicated)
        setHasDuplicates(false)
        return deduplicated
    }

    const onClose = () => {
        setIsOpen(false)
        setErrorMessage(null)
    }

    const onCancel = () => {
        setCharacters(acceptedCharacters)
        onClose()
    }

    const onAccept = () => {
        setErrorMessage(null)
        const deduplicated = removeDuplicates()

        if (deduplicated.length === 0) {
            setErrorMessage("You need to specify at least one character")
            return
        }

        setAcceptedCharacters(deduplicated)
        onClose()
    }

    const onCharactersChange = (el: ChangeEvent<HTMLTextAreaElement>) => {
        setCharacters(el.target.value)
        setHasDuplicates(/(.).*\1/.test(el.target.value))
        setErrorMessage(null)
    }

    const onPresetChosen = (preset: UnicodeRange) => {
        setCharacters(getUnicodeRangeChars(preset))
    }

    const renderPreset: ItemRenderer<UnicodeRange> = (preset, { handleClick, handleFocus, modifiers, query}) => {
        if (!modifiers.matchesPredicate) {
            return null
        }
        
        return (
            <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={preset.category}
                onClick={handleClick}
                onFocus={handleFocus}
                roleStructure="listoption"
                text={preset.category}
                label={`${preset.range[1] - preset.range[0]} characters`}
            />
        )
    }

    const presetPredicate: ItemPredicate<UnicodeRange> = (query, preset, _index, exactMatch) => {
        const normalizedQuery = query.toLowerCase()
        const normalizedName = preset.category.toLowerCase()

        if (exactMatch) {
            return normalizedQuery === normalizedName
        } else {
            return normalizedName.includes(normalizedQuery)
        }
    }

    return (
        <Dialog
            title="Character Set"
            icon="translate"
            isOpen={isOpen}
            onClose={onClose}
        >
            <DialogBody>
                <p>
                    {characters.length} characters&nbsp;
                    { hasDuplicates &&
                        <Tooltip content="Counter includes duplicates which will be removed after accepting the changes" compact>
                            <Icon icon="warning-sign" intent="warning" />
                        </Tooltip>
                    }
                </p>
                <TextArea
                    fill
                    value={characters}
                    onChange={onCharactersChange}
                    rows={5}
                />
                <ButtonGroup>
                    <Select<UnicodeRange>
                        items={unicodeRanges}
                        itemRenderer={renderPreset}
                        itemPredicate={presetPredicate}
                        noResults={
                            <MenuItem disabled text="No presets found" roleStructure="listoption" />
                        }
                        onItemSelect={onPresetChosen}
                        popoverProps={{ minimal: true }}
                    >
                        <Tooltip content="Predefined character sets" compact>
                            <Button icon="font" text="Override with preset" endIcon="caret-down" />
                        </Tooltip>
                    </Select>
                    <Tooltip content="Remove duplicates" compact>
                        <Button icon="inbox-filtered" disabled={!hasDuplicates} onClick={removeDuplicates} />
                    </Tooltip>
                </ButtonGroup>
                { errorMessage &&
                    <Callout intent="danger">
                        {errorMessage}
                    </Callout>
                }
            </DialogBody>
            <DialogFooter actions={
                <>
                    <Button text="Cancel" onClick={onCancel} />
                    <Button intent="primary" text="Accept" onClick={onAccept} />
                </>
            } />
        </Dialog>
    )
}
