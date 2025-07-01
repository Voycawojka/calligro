import { FormGroup, InputGroup, NumericInput, Tag } from "@blueprintjs/core";
import {useContext, useEffect, useState } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { ProjectLoadContext } from "../../ProjectContext";

export interface Props {
    project: ProjectData
}

export default function FontMarginsInput({ project }: Props) {
    const setProjectContext = useContext(ProjectLoadContext)

    const [hMargin, setHMargin] = useState(project.horizontalSpacing.toString())
    const [vMargin, setVMargin] = useState(project.verticalSpacing.toString())
    const [lineHeight, setLineHeight] = useState(project.lineHeight)

    useEffect(() => {
        const val = Number(hMargin)
        if (!isNaN(val) && val !== project.horizontalSpacing) {
            setProjectContext({
                ...project,
                horizontalSpacing: Number(hMargin),
                dirty: true,
            })
        }
    }, [hMargin])

    useEffect(() => {
        const val = Number(vMargin)
        if (!isNaN(val) && val !== project.verticalSpacing) {
            setProjectContext({
                ...project,
                verticalSpacing: Number(vMargin),
                dirty: true,
            })
        }
    }, [vMargin])

    useEffect(() => {
        if (lineHeight !== project.lineHeight) {
            setProjectContext({
                ...project,
                lineHeight: lineHeight,
                dirty: true,
            })
        }
    }, [lineHeight])

    useEffect(() => {
        setHMargin(project.horizontalSpacing.toString())
        setVMargin(project.verticalSpacing.toString())
        setLineHeight(project.lineHeight)
    }, [project.horizontalSpacing, project.verticalSpacing, project.lineHeight])

    return (
        <>
            <FormGroup label="Horizontal spacing">
                <InputGroup
                    value={hMargin}
                    onValueChange={setHMargin}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                />
            </FormGroup>
            <FormGroup label="Vertical spacing">
                <InputGroup
                    value={vMargin}
                    onValueChange={setVMargin}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                />
            </FormGroup>
            <FormGroup label="Line height">
                <InputGroup
                    value={lineHeight.toString()}
                    onValueChange={value => setLineHeight(Number(value))}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    min={1}
                    size="small"
                />
            </FormGroup>
        </>
    )
}
