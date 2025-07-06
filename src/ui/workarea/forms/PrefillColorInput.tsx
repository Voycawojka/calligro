import { FormGroup, InputGroup } from "@blueprintjs/core";
import { ProjectData } from "../../../filesystem/projectstore";
import { useContext, useEffect, useState } from "react";
import { ProjectLoadContext } from "../../ProjectContext";

export interface Props {
    project: ProjectData
}

export default function PrefillColorInput({ project }: Props) {
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
        <FormGroup label="Pre-fill color" disabled={!project.prefill}>
            <InputGroup
                disabled={!project.prefill}
                type="color"
                leftIcon="tint"
                value={color}
                onValueChange={setColor}
            />
        </FormGroup>
    )
}
