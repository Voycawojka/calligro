import { FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import { ProjectData } from "../../../filesystem/projectstore";
import { useProjectStateNumericInput } from "../hooks/useProjectStateNumericInput";
import SizeOverrideInput from "./SizeOverrideInput";

export interface Props {
    project: ProjectData
}

export default function SizeInput({ project }: Props) {
    const [width, setWidth] = useProjectStateNumericInput("defaultCharacterWidth", project)
    const [height, setHeight] = useProjectStateNumericInput("defaultCharacterHeight", project)
    const [base, setBase] = useProjectStateNumericInput("characterBase", project)

    return (
        <>
            <FormGroup label="Char. width">
                <InputGroup
                    value={width}
                    onValueChange={setWidth}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                    min={1}
                />
            </FormGroup>
            <FormGroup label="Char. height">
                <InputGroup
                    value={height}
                    onValueChange={setHeight}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                    min={1}
                />
            </FormGroup>
            <FormGroup label="Char. base">
                <InputGroup
                    value={base}
                    onValueChange={setBase}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                    min={0}
                />
            </FormGroup>
            <SizeOverrideInput project={project} />
        </>
    )
}
