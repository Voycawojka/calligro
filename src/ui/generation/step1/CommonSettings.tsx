import React, { useEffect, useState } from "react"
import { Autocomplete, TextField } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { findSystemFonts } from "../../../generation/template/fontsDetection"

interface CommonSettingsProps {
    defaultWidth: number
    defaultHeight: number
    defaultBase: number
    onWidthChanged: (value: number) => void
    onHeightChanged: (value: number) => void
    onBaseChanged: (value: number) => void
    onPrefillChanged: (value: string | null) => void
}

export function CommonSettings(props: CommonSettingsProps) {
    const [systemFonts, setSystemFonts] = useState([] as string[])

    useEffect(() => {
        findSystemFonts().then(fonts => setSystemFonts(fonts))
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid xs={6}>
                <TextField
                    label="Character width"
                    type="number"
                    fullWidth
                    defaultValue={props.defaultWidth}
                    onChange={event => props.onWidthChanged(parseInt(event.target.value))}
                />
            </Grid>
            <Grid xs={6}>
                <TextField
                    label="Character height"
                    type="number"
                    fullWidth
                    defaultValue={props.defaultHeight}
                    onChange={event => props.onHeightChanged(parseInt(event.target.value))}
                />
            </Grid>
            <Grid xs={12}>
                <TextField
                    label="Character base"
                    type="number"
                    fullWidth
                    defaultValue={props.defaultBase}
                    onChange={event => props.onBaseChanged(parseInt(event.target.value))}
                />
            </Grid>
            <Grid xs={12}>
                <Autocomplete
                    fullWidth
                    disablePortal
                    options={systemFonts}
                    renderInput={(params) => <TextField {...params} label="Prefill with font" />}
                    defaultValue={null}
                    onChange={(_event, value) => props.onPrefillChanged(value)}
                />
            </Grid>
        </Grid>
    )
}