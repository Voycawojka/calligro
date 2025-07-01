import { FormGroup, InputGroup, NumericInput, Tag, Tooltip } from "@blueprintjs/core";
import {useContext, useEffect, useState } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { ProjectLoadContext } from "../../ProjectContext";

export interface Props {
    project: ProjectData
}

export default function SizeInput({ project }: Props) {
    const setProjectContext = useContext(ProjectLoadContext)

    const [width, setWidth] = useState(project.defaultCharacterWidth)
    const [height, setHeight] = useState(project.defaultCharacterHeight)
    const [base, setBase] = useState(project.characterBase)

    useEffect(() => {
        if (width !== project.defaultCharacterWidth) {
            setProjectContext({
                ...project,
                defaultCharacterWidth: width,
                dirty: true
            })
        }
    }, [width])

    useEffect(() => {
        if (height !== project.defaultCharacterHeight) {
            setProjectContext({
                ...project,
                defaultCharacterHeight: height,
                dirty: true
            })
        }
    }, [height])

    useEffect(() => {
        if (base !== project.characterBase) {
            setProjectContext({
                ...project,
                characterBase: base,
                dirty: true
            })
        }
    }, [base])

    useEffect(() => {
        setWidth(project.defaultCharacterWidth)
        setHeight(project.defaultCharacterHeight)
        setBase(project.characterBase)
    }, [project.defaultCharacterWidth, project.defaultCharacterHeight, project.characterBase])


    const setHeightBelowBase = (value: number) => {
        setHeight(value + base)
    }

    return (
        <>
            <FormGroup label="Char. width">
                <InputGroup
                    value={width.toString()}
                    onValueChange={value => setWidth(Number(value))}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                    min={1}
                />
            </FormGroup>
            <FormGroup label="Char. height (above base)">
                <InputGroup
                    value={base.toString()}
                    onValueChange={value => setWidth(Number(value))}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                    min={1}
                />
            </FormGroup>
            <FormGroup label="Char. height (below base)">
                <InputGroup
                    value={(height - base).toString()}
                    onValueChange={value => setHeightBelowBase(Number(value))}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                    min={0}
                />
            </FormGroup>
        </>
    )
}
