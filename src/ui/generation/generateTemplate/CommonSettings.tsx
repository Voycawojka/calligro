import React, { useEffect, useState } from "react"
import { Autocomplete, TextField, css } from "@mui/material"
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
    const [width, setWidth] = useState(props.defaultWidth)
    const [height, setHeight] = useState(props.defaultHeight)
    const [base, setBase] = useState(props.defaultBase)

    useEffect(() => {
        findSystemFonts().then(fonts => setSystemFonts(fonts))
    }, [])

    const changeWidth = (value: number) => {
        const newValue = value > 0 ? value : 1
        setWidth(newValue)
        props.onWidthChanged(newValue)
    }

    const changeHeight = (value: number) => {
        const newValue = value > 0 ? value : 1
        setHeight(newValue)
        props.onHeightChanged(newValue)
    }

    const changeBase = (value: number) => {
        const newValue = value >= 0 ? value : 0
        setBase(newValue)
        props.onBaseChanged(newValue)
    }

    return (
        <Grid container spacing={2}>
            <Grid xs={6}>
                <TextField
                    label="Character width"
                    type="number"
                    fullWidth
                    value={width}
                    onChange={event => changeWidth(parseInt(event.target.value))}
                />
            </Grid>
            <Grid xs={6}>
                <TextField
                    label="Character height"
                    type="number"
                    fullWidth
                    value={height}
                    onChange={event => changeHeight(parseInt(event.target.value))}
                />
            </Grid>
            <Grid xs={12}>
                <TextField
                    label="Character base"
                    type="number"
                    fullWidth
                    value={base}
                    onChange={event => changeBase(parseInt(event.target.value))}
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