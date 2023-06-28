import React, { useEffect, useState } from "react"
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import unicodeRanges from "../../../utils/unicodeRanges"
import { useDebounce } from "usehooks-ts"

interface CharactersProps {
    defaultPreset: string
    onCharacterStringChanged: (value: string) => void
}

function createCharacterStringFromPreset(preset: string) {
    const activeRange = unicodeRanges.find(range => range.category === preset)

    if (activeRange) {
        let charString = ''

        for (let i = activeRange.range[0]; i < activeRange.range[1] + 1; i++) {
            charString += String.fromCharCode(i)
        }

        return charString
    } else {
        return ''
    }
}

export function Characters(props: CharactersProps) {
    const [chosenPreset, setChosenPreset] = useState(props.defaultPreset)
    const [charactersString, setCharactersString] = useState('')
    const [mode, setMode] = useState('preset')
    const charactersStringDebounce = useDebounce(charactersString, 500)
    
    const updatePreset = (preset: string) => {
        const newString = createCharacterStringFromPreset(preset)

        setChosenPreset(preset)
        setCharactersString(newString)
    }

    const updateMode = (mode: string) => {
        setMode(mode)

        if (mode === 'preset') {
            updatePreset(chosenPreset)
        }
    }

    useEffect(() => {
        updatePreset(chosenPreset)
    }, [])

    useEffect(() => {
        props.onCharacterStringChanged(charactersString)
    }, [charactersStringDebounce])

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Font characters mode</InputLabel>
                        <Select
                            label="Font characters mode"
                            value={mode}
                            onChange={event => updateMode(event.target.value)}
                        >
                            <MenuItem value={'preset'}>Preset</MenuItem>
                            <MenuItem value={'custom'}>Custom</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                    <Autocomplete
                        fullWidth
                        disablePortal
                        options={unicodeRanges.map(range => range.category)}
                        renderInput={(params) => <TextField {...params} label="Character set" />}
                        value={chosenPreset}
                        onChange={(_event, value) => updatePreset(value ?? props.defaultPreset)}
                        disabled={mode === 'custom'}
                    />
                </Grid>
                <Grid xs={12}>
                    <TextField
                        label="Characters to include in the font"
                        multiline
                        fullWidth
                        rows={4}
                        value={charactersString}
                        onChange={event => setCharactersString(event.target.value)}
                        disabled={mode === 'preset'}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}
