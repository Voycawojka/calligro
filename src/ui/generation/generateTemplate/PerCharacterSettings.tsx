import React, { useEffect, useState } from 'react'
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { AddCircle, Clear, ModeEdit } from '@mui/icons-material'

interface PerCharacterSettingsProps {
    characterString: string
    commonWidth: number
    commonHeight: number
    onOverriddenCharactersChange: (overrides: OverriddenCharacter[]) => void
}

export interface OverriddenCharacter {
    char: string | null
    width: number
    height: number
}

export function PerCharacterSettings(props: PerCharacterSettingsProps) {
    const [overriddenCharacters, setOverriddenCharacters] = useState<OverriddenCharacter[]>([])
    const [possibleCharacters, setPossibleCharacters] = useState<string[]>([])
    const [editedRow, setEditedRow] = useState<number | null>(null)
    const [editedRowCharacterError, setEditedRowCharacterError] = useState<string | null>(null)

    useEffect(() => {
        const newPossibles = props.characterString.split('')
        const newOverrides = overriddenCharacters.filter(override => !!override.char && newPossibles.includes(override.char))

        setPossibleCharacters(newPossibles)
        setOverriddenCharacters(newOverrides)
        setEditedRow(null)
        props.onOverriddenCharactersChange(newOverrides)
    }, [props.characterString])

    const addOverride = () => {
        setOverriddenCharacters([
            { char: null, width: props.commonWidth, height: props.commonHeight },
            ...overriddenCharacters
        ])
        setEditedRow(0)
    }

    const removeOverride = (index: number) => {
        setOverriddenCharacters(overriddenCharacters.filter((_, i) => i !== index))
        setEditedRow(null)
        setEditedRowCharacterError(null)
        props.onOverriddenCharactersChange(overriddenCharacters)
    }

    const setOverrideChar = (index: number, char: string | null) => {
        const newOverrides = [...overriddenCharacters]
        
        newOverrides[index].char = char
        setOverriddenCharacters(newOverrides)
    }

    const setOverrideWidth = (index: number, width: number) => {
        const newOverrides = [...overriddenCharacters]
        const newWidth = width > 0 ? width : 1;
        
        newOverrides[index].width = newWidth;
        setOverriddenCharacters(newOverrides)
    }

    const setOverrideHeight = (index: number, height: number) => {
        const newOverrides = [...overriddenCharacters]
        const newHeight = height > 0 ? height : 1
        
        newOverrides[index].height = newHeight;
        setOverriddenCharacters(newOverrides)
    }

    const removeEditedRow = () => {
        if (editedRow !== null) {
            removeOverride(editedRow)
        } else {
            console.warn("Tried to remove edited character settings row but no row is being edited.")
        }
    }

    const closeEditingModal = () => {
        if (editedRow === null) {
            console.warn("Tried to close character settings edit modal but no row is being edited.")
            return
        }
        const chosenChar = overriddenCharacters[editedRow].char
        if (chosenChar === null || chosenChar === '') {
            setEditedRowCharacterError("Choose a character")
            return
        }
        if (overriddenCharacters.find((override, index) => override.char === chosenChar && index != editedRow)) {
            setEditedRowCharacterError("This character is already overwritten")
            return
        }
        setEditedRowCharacterError(null)
        setEditedRow(null)
        props.onOverriddenCharactersChange(overriddenCharacters)
    }

    return (
        <>
            <Dialog open={editedRow !== null} onClose={closeEditingModal}>
                <DialogTitle>Character Settings</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Specify options that will only apply to the chosen character
                    </DialogContentText>                
                    { editedRow !== null && (
                        <Stack spacing={2}>
                            <Autocomplete
                                fullWidth
                                disablePortal
                                options={possibleCharacters}
                                renderInput={(params) => (
                                    <TextField
                                        label="Character"
                                        error={!!editedRowCharacterError}
                                        helperText={editedRowCharacterError}
                                        {...params}
                                    />
                                )}
                                value={overriddenCharacters[editedRow].char}
                                onChange={(_event, value) => setOverrideChar(editedRow, value)}
                            />

                            <TextField
                                label="Width"
                                type="number"
                                fullWidth
                                value={overriddenCharacters[editedRow].width}
                                onChange={event => setOverrideWidth(editedRow, parseInt(event.target.value))}
                            />
                            <TextField
                                label="Height"
                                type="number"
                                fullWidth
                                value={overriddenCharacters[editedRow].height}
                                onChange={event => setOverrideHeight(editedRow, parseInt(event.target.value))}
                            />
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={removeEditedRow}>Remove</Button>
                    <Button onClick={closeEditingModal}>Done</Button>
                </DialogActions>
            </Dialog>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableCell></TableCell>
                        <TableCell>Character</TableCell>
                        <TableCell>Width</TableCell>
                        <TableCell>Height</TableCell>
                        <TableCell>
                            <Button onClick={() => addOverride()}><AddCircle /></Button>
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        {overriddenCharacters.map((override, index) => (
                            <TableRow>
                                <TableCell>
                                    <Button onClick={() => setEditedRow(index)}><ModeEdit /></Button>
                                </TableCell>
                                <TableCell>
                                    {override.char}
                                </TableCell>
                                <TableCell>
                                    {override.width}
                                </TableCell>
                                <TableCell>
                                    {override.height}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => removeOverride(index)}><Clear /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
