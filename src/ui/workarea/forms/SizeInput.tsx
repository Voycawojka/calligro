import { FormGroup, InputGroup, Tag } from "@blueprintjs/core";
import { ProjectData } from "../../../filesystem/projectstore";
import { useProjectStateNumericInput } from "../hooks/useProjectStateNumericInput";
import SizeOverrideInput from "./SizeOverrideInput";
import styles from "./sizeinput.module.css"

export interface Props {
    project: ProjectData
    forceDisabled: boolean
}

export default function SizeInput({ project, forceDisabled }: Props) {
    const [width, setWidth] = useProjectStateNumericInput("defaultCharacterWidth", project)
    const [height, setHeight] = useProjectStateNumericInput("defaultCharacterHeight", project)
    const [base, setBase] = useProjectStateNumericInput("characterBase", project)

    return (
        <>
            <div className={styles.sizecontainer}>
                <div>
                    <FormGroup label="Char. width" disabled={forceDisabled}>
                        <InputGroup
                            value={width}
                            onValueChange={setWidth}
                            type="number"
                            rightElement={<Tag minimal>px</Tag>}
                            size="small"
                            min={1}
                            disabled={forceDisabled}
                        />
                    </FormGroup>
                    <FormGroup label="Char. height" disabled={forceDisabled}>
                        <InputGroup
                            value={height}
                            onValueChange={setHeight}
                            type="number"
                            rightElement={<Tag minimal>px</Tag>}
                            size="small"
                            min={1}
                            disabled={forceDisabled}
                        />
                    </FormGroup>
                    <FormGroup label="Char. base" disabled={forceDisabled}>
                        <InputGroup
                            value={base}
                            onValueChange={setBase}
                            type="number"
                            rightElement={<Tag minimal>px</Tag>}
                            size="small"
                            min={0}
                            disabled={forceDisabled}
                        />
                    </FormGroup>
                </div>
                <img src="/img/info/size-info.svg" alt="Size info" height={180} />
            </div>
            <SizeOverrideInput project={project} forceDisabled={forceDisabled} />
        </>
    )
}
