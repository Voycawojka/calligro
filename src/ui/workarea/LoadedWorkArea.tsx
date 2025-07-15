import { Button, Callout, Classes, Divider, H4, Switch } from "@blueprintjs/core"
import { ProjectData } from "../../filesystem/projectstore"

import styles from "./workarea.module.scss"
import PrefillInput from "./forms/PrefillInput"
import CharacterSetInput from "./forms/CharacterSetInput"
import SizeInput from "./forms/SizeInput"
import FontPreview from "./canvas/FontPreview"
import PreviewTemplateButton from "./forms/PreviewTemplateButton"
import FontMarginsInput from "./forms/FontMarginsInput"
import KerningPairsInput from "./forms/KerningPairsInput"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { useRef, useState } from "react"
import useResizeObserver from "@react-hook/resize-observer"
import PrefillColorInput from "./forms/PrefillColorInput"
import PrefillOutlineInput from "./forms/PrefillOutlineInput"

export interface Props {
    project: ProjectData
}

export default function LoadedWorkArea({ project }: Props) {
    const [minSize, setMinSize] = useState(0)
    const [isForceEditTemplate, setForceEditTemplate] = useState(false)

    const panelRef = useRef<HTMLDivElement | null>(null)

    useResizeObserver(panelRef, entry => {
        setMinSize(200 / entry.contentRect.width * 100)
    })

    const templateDisabled = !!project.importedTemplate && !isForceEditTemplate

    return (
        <div ref={panelRef}>
            <PanelGroup direction="horizontal">
                <Panel id="template-settings" order={1} minSize={minSize}>
                    <div className={`${styles.formcontainer}`}>
                        <H4>Template Settings</H4>
                        { project.importedTemplate &&
                            <Callout intent="warning">
                                A template was imported. The settings in this section will have no effect on the font until they are exported and reimported.
                                <Switch label="Understood, edit anyway" checked={isForceEditTemplate} onChange={e => setForceEditTemplate(e.target.checked)} />
                            </Callout>
                        }
                        <PrefillInput project={project} forceDisabled={templateDisabled} />
                        <PrefillColorInput project={project} forceDisabled={templateDisabled} />
                        <PrefillOutlineInput project={project} forceDisabled={templateDisabled} />
                        <Divider />
                        <CharacterSetInput project={project} forceDisabled={templateDisabled} />
                        <SizeInput project={project} forceDisabled={templateDisabled} />
                        <Divider />
                        <PreviewTemplateButton project={project} forceDisabled={templateDisabled} />
                    </div>
                </Panel>
                <PanelResizeHandle id="template-font-handle" className={Classes.DIVIDER} />
                <Panel id="font-settings" order={2} minSize={minSize}>
                    <div className={`${styles.formcontainer}`}>
                            <H4>Font Settings</H4>
                            <FontMarginsInput project={project} />
                            <KerningPairsInput project={project} />
                    </div>
                </Panel>
                <PanelResizeHandle id="font-canvas-handle" className={Classes.DIVIDER}  />
                <Panel id="canvas" order={3} minSize={minSize}>
                    <div className={`${styles.canvascontainer}`}>
                            <FontPreview project={project} />
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    )
}
