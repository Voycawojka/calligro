import { FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import { ProjectData } from "../../../filesystem/projectstore";
import { useProjectStateNumericInput } from "../hooks/useProjectStateNumericInput";

export interface Props {
    project: ProjectData
}

export default function FontMarginsInput({ project }: Props) {
    const [hMargin, setHMargin] = useProjectStateNumericInput("horizontalSpacing", project)
    const [vMargin, setVMargin] = useProjectStateNumericInput("verticalSpacing", project)
    const [lineHeight, setLineHeight] = useProjectStateNumericInput("lineHeight", project)

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
                    value={lineHeight}
                    onValueChange={setLineHeight}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    min={1}
                    size="small"
                />
            </FormGroup>
        </>
    )
}
