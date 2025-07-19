import { FormGroup, InputGroup } from "@blueprintjs/core";
import { ProjectData } from "../../../filesystem/projectstore";
import { useContext, useEffect, useState } from "react";
import { ProjectLoadContext } from "../../contexts/ProjectContext";

export interface Props {
    project: ProjectData
    forceDisabled: boolean
}

export default function PrefillColorInput({ project, forceDisabled }: Props) {
    const [color, setColor] = useState(project.prefillColor)

    const setProjectContext = useContext(ProjectLoadContext)

   useEffect(() => {
        if (color !== project.prefillColor) {
            setProjectContext({
                ...project,
                prefillColor: color,
                dirty: true,
            })
        }
   }, [color])

   useEffect(() => {
        setColor(project.prefillColor)
   }, [project.prefillColor])

    return (
        <FormGroup label="Pre-fill color" disabled={!project.prefill || forceDisabled}>
            <InputGroup
                disabled={!project.prefill || forceDisabled}
                type="color"
                leftIcon="tint"
                value={color}
                onValueChange={setColor}
            />
        </FormGroup>
    )
}
