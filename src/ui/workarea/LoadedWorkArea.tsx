import { Card, Classes, Divider, H4, Tab, Tabs } from "@blueprintjs/core"
import { ProjectData } from "../../filesystem/projectstore"

import styles from "./workarea.module.scss"
import PrefillInput from "./forms/PrefillInput"
import CharacterSetInput from "./forms/CharacterSetInput"
import SizeInput from "./forms/SizeInput"
import FontPreview from "./canvas/FontPreview"
import PreviewTemplateButton from "./forms/PreviewTemplateButton"
import FontMarginsInput from "./forms/FontMarginsInput"

export interface Props {
    project: ProjectData
}

export default function LoadedWorkArea({ project }: Props) {
    return (
        <div className={styles.worksplit}>
            <div className={`${styles.formcontainer}`}>
                    <H4>Template Settings</H4>
                    <PrefillInput project={project} />
                    <CharacterSetInput project={project} />
                    <SizeInput project={project} />
                    <PreviewTemplateButton project={project} />
            </div>
            <Divider />
            <div className={`${styles.formcontainer}`}>
                    <H4>Font Settings</H4>
                    <FontMarginsInput project={project} />
            </div>
            <Divider />
            <div className={`${styles.canvascontainer}`}>
                    <FontPreview project={project} />
            </div>
        </div>
    )
}
