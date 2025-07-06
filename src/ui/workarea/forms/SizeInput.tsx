import { FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import { ProjectData } from "../../../filesystem/projectstore";
import { useProjectStateNumericInput } from "../hooks/useProjectStateNumericInput";

export interface Props {
    project: ProjectData
}

export default function SizeInput({ project }: Props) {
    const [width, setWidth] = useProjectStateNumericInput("defaultCharacterWidth", project)
    const [height, setHeight] = useProjectStateNumericInput("defaultCharacterHeight", project)
    const [base, setBase] = useProjectStateNumericInput("characterBase", project)

    const setHeightBelowBase = (value: number) => {
        setHeight(value + base)
    }

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
            <FormGroup label="Char. height (above base)">
                <InputGroup
                    value={base}
                    onValueChange={setBase}
                    type="number"
                    rightElement={<Tag minimal>px</Tag>}
                    size="small"
                    min={1}
                />
            </FormGroup>
            <FormGroup label="Char. height (below base)">
                <InputGroup
                    value={(Number(height) - Number(base)).toString()}
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
