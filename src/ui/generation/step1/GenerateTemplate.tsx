import React, { useState } from "react"
import Grid from '@mui/material/Unstable_Grid2' 
import { Characters } from "./Characters"
import { CommonSettings } from "./CommonSettings"
import { OverriddenCharacter, PerCharacterSettings } from "./PerCharacterSettings"
import { Button, Stack } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { isElectron } from "../../../electron/electronInterop"
import Template, { FontOptions } from "../../../generation/template/Template"
import { downloadTemplate } from "../../../generation/template/download"
import { Slot } from "../../../generation/template/types"

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null

function constructFontOptions(prefill: string | null): FontOptions | null {
    return !!prefill ? {
        name: prefill,
        fillColor: 'black',
        outlineColor: ''
    } : null
}

function constructSlots(characterString: string, characterOverrides: OverriddenCharacter[], charWidth: number, charHeight: number): Slot[] {
    const overridesMap: { [key: string]: OverriddenCharacter}  = Object.fromEntries(characterOverrides.map(override => [override.char, override]))
    return [...new Set(characterString.split(''))].map(char => {
        const override: OverriddenCharacter | undefined = overridesMap[char]
        if (override) {
            return {
                character: char,
                width: override.width,
                height: override.height
            }
        } else {
            return {
                character: char,
                width: charWidth,
                height: charHeight
            }
        }
    })
}

export function GenerateTemplate() {
    const defaultCharWidth = 100
    const defaultCharHeight = 100
    const defaultCharBase = 70

    const [characterString, setCharacterString] = useState('')
    const [presetName, setPresetName] = useState('custom')
    const [charWidth, setCharWidth] = useState(defaultCharWidth)
    const [charHeight, setCharHeight] = useState(defaultCharHeight)
    const [charBase, setCharBase] = useState(defaultCharBase)
    const [prefill, setPrefill] = useState<string | null>(null)
    const [characterOverrides, setCharacterOverrides] = useState<OverriddenCharacter[]>([])
    const [templateLoading, setTemplateLoading] = useState(false)

    const constructAndDownloadTemplate = async () => {
        setTemplateLoading(true)

        const fontOptions: FontOptions | null = constructFontOptions(prefill)
        const slots: Slot[] = constructSlots(characterString, characterOverrides, charWidth, charHeight)
        const template = new Template(slots, charBase, presetName, fontOptions)

        if (isElectron()) {
            const image = await template.generateImageBlob()
            const imageBlobArrayBuffer = await image.arrayBuffer()

            ipcRenderer?.send('save-template', imageBlobArrayBuffer, template.generateTemplateCode(), template.readmeContent)
        } else {
            downloadTemplate(template)
        }

        setTemplateLoading(false)
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Characters
                    defaultPreset="Basic Latin"
                    onCharacterStringChanged={value => setCharacterString(value)}
                    onPresetNameChanged={value => setPresetName(value)}
                />
            </Grid>
            <Grid xs={12} md={6}>
                <Stack spacing={2}>
                    <CommonSettings
                        defaultWidth={defaultCharWidth}
                        defaultHeight={defaultCharHeight}
                        defaultBase={defaultCharBase}
                        onWidthChanged={value => setCharWidth(value)}
                        onHeightChanged={value => setCharHeight(value)}
                        onBaseChanged={value => setCharBase(value)}
                        onPrefillChanged={value => setPrefill(value)}
                    />
                    <LoadingButton
                        loading={templateLoading}
                        variant="contained"
                        onClick={() => constructAndDownloadTemplate()}
                    >
                        {`${isElectron() ? 'save' : 'download'} template`}
                    </LoadingButton>
                </Stack>
            </Grid>
            <Grid xs={12} md={6}>
                <PerCharacterSettings
                    characterString={characterString}
                    commonWidth={charWidth}
                    commonHeight={charHeight}
                    onOverriddenCharactersChange={overrides => setCharacterOverrides(overrides)}
                />
            </Grid>
        </Grid>
    )
}
