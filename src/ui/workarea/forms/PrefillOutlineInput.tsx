import { FormGroup, InputGroup } from "@blueprintjs/core";
import { ProjectData } from "../../../filesystem/projectstore";
import { useContext, useEffect, useState } from "react";
import { ProjectLoadContext } from "../../contexts/ProjectContext";

export interface Props {
    project: ProjectData
    forceDisabled: boolean
}

export default function PrefillOutlineInput({ project, forceDisabled }: Props) {
    const [size, setSize] = useState(project.prefillOutline)
    const [color, setColor] = useState(project.prefillOutlineColor)

    const setProjectContext = useContext(ProjectLoadContext)

    useEffect(() => {
        if (size !== project.prefillOutline) {
            setProjectContext({
                ...project,
                prefillOutline: size,
                dirty: true,
            })
        }
    }, [size])

    useEffect(() => {
        if (color !== project.prefillOutlineColor) {
            setProjectContext({
                ...project,
                prefillOutlineColor: color,
                dirty: true,
            })
        }
    }, [color])

    useEffect(() => {
        setSize(project.prefillOutline)
    }, [project.prefillOutline])

    useEffect(() => {
        setColor(project.prefillOutlineColor)
    }, [project.prefillOutlineColor])

    return (
            <FormGroup label="Pre-fill outline" disabled={!project.prefill || forceDisabled}>
                    <InputGroup
                        disabled={!project.prefill || forceDisabled}
                        type="number"
                        leftIcon="dot"
                        value={size.toString()}
                        onValueChange={v => setSize(Number(v))}
                        rightElement={(
                            <InputGroup
                                disabled={!project.prefill || forceDisabled}
                                type="color"
                                style={{ minWidth: "50px" }}
                                value={color}
                                onValueChange={setColor}
                            />
                        )}
                    />
            </FormGroup>
    )
}
