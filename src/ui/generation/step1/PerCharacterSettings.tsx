import React, { useEffect, useState } from 'react'
import { Autocomplete, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { useDebounce } from 'usehooks-ts'

interface PerCharacterSettingsProps {
    characterString: string
    commonWidth: number
    commonHeight: number
}

interface OverriddenCharacter {
    char: string | null
    width: number
    height: number
}

export function PerCharacterSettings(props: PerCharacterSettingsProps) {
    const [overriddenCharacters, setOverriddenCharacters] = useState<OverriddenCharacter[]>([])
    const [possibleCharacters, setPossibleCharacters] = useState<string[]>([])
    const [editingRow, setEditingRow] = useState<number | null>(null)

    useEffect(() => {
        const newPossibles = props.characterString.split('')
        const newOverrides = overriddenCharacters.filter(override => !!override.char && newPossibles.includes(override.char))

        setPossibleCharacters(newPossibles)
        setOverriddenCharacters(newOverrides)
        setEditingRow(null)
    }, [props.characterString])

    const addOverride = () => {
        setOverriddenCharacters([
            { char: null, width: props.commonWidth, height: props.commonHeight },
            ...overriddenCharacters
        ])
        setEditingRow(0)
    }

    const removeOverride = (index: number) => {
        setOverriddenCharacters(overriddenCharacters.filter((_, i) => i !== index))
        setEditingRow(null)
    }

    const setOverrideChar = (index: number, char: string | null) => {
        const newOverrides = [...overriddenCharacters]
        
        newOverrides[index].char = char
        setOverriddenCharacters(newOverrides)
    }

    const setOverrideWidth = (index: number, width: number) => {
        const newOverrides = [...overriddenCharacters]
        
        newOverrides[index].width = width;
        setOverriddenCharacters(newOverrides)
    }

    const setOverrideHeight = (index: number, height: number) => {
        const newOverrides = [...overriddenCharacters]
        
        newOverrides[index].height = height;
        setOverriddenCharacters(newOverrides)
    }

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableCell></TableCell>
                    <TableCell>Character</TableCell>
                    <TableCell>Width</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>
                        <Button onClick={() => addOverride()}>+</Button>
                    </TableCell>
                </TableHead>
                <TableBody>
                    {overriddenCharacters.map((override, index) => editingRow == index ? (
                        <TableRow>
                            <TableCell>
                                <Button onClick={() => setEditingRow(null)}>X</Button>
                            </TableCell>
                            <TableCell>
                                <Autocomplete
                                    fullWidth
                                    disablePortal
                                    options={possibleCharacters}
                                    renderInput={(params) => <TextField {...params}  />}
                                    value={override.char}
                                    onChange={(_event, value) => setOverrideChar(index, value)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    fullWidth
                                    value={override.width}
                                    onChange={event => setOverrideWidth(index, parseInt(event.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    fullWidth
                                    value={override.height}
                                    onChange={event => setOverrideHeight(index, parseInt(event.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => removeOverride(index)}>-</Button>
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow>
                            <TableCell>
                                <Button onClick={() => setEditingRow(index)}>edit</Button>
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
                                <Button onClick={() => removeOverride(index)}>-</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
