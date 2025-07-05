import { Callout, Classes, Divider, H4, H5, H6 } from "@blueprintjs/core"
import { ProjectData } from "../../filesystem/projectstore"

import styles from "./workarea.module.scss"
import PrefillInput from "./forms/PrefillInput"
import CharacterSetInput from "./forms/CharacterSetInput"
import SizeInput from "./forms/SizeInput"
import FontPreview from "./canvas/FontPreview"
import PreviewTemplateButton from "./forms/PreviewTemplateButton"
import FontMarginsInput from "./forms/FontMarginsInput"
import KerningPairsInput from "./forms/KerningPairsInput"
import { ImperativePanelGroupHandle, Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { useRef, useState } from "react"
import useResizeObserver from "@react-hook/resize-observer"
import PrefillColorInput from "./forms/PrefillColorInput"
import PrefillOutlineInput from "./forms/PrefillOutlineInput"

export interface Props {
    project: ProjectData
}

export default function LoadedWorkArea({ project }: Props) {
    const [groupWidth, setGroupWidth] = useState(0)

    const panelRef = useRef(null as HTMLDivElement | null)

    useResizeObserver(panelRef, entry => {
        setGroupWidth(entry.contentRect.width)
    })

    const minSize = (pixels: number) => pixels / groupWidth * 100

    return (
        <div ref={panelRef}>
            <PanelGroup direction="horizontal">
                <Panel id="template-settings" order={1} minSize={minSize(200)}>
                    <div className={`${styles.formcontainer}`}>
                        <H4>Template Settings</H4>
                        { project.importedTemplate &&
                            <Callout intent="warning">
                                A template was imported. The settings in this section will have no effect on the font until they are exported and reimported.
                            </Callout>
                        }
                        <PrefillInput project={project} />
                        <PrefillColorInput project={project} />
                        <PrefillOutlineInput project={project} />
                        <Divider />
                        <CharacterSetInput project={project} />
                        <SizeInput project={project} />
                        <Divider />
                        <PreviewTemplateButton project={project} />
                    </div>
                </Panel>
                <PanelResizeHandle id="template-font-handle" className={Classes.DIVIDER} />
                <Panel id="font-settings" order={2} minSize={minSize(200)}>
                    <div className={`${styles.formcontainer}`}>
                            <H4>Font Settings</H4>
                            <FontMarginsInput project={project} />
                            <KerningPairsInput project={project} />
                    </div>
                </Panel>
                <PanelResizeHandle id="font-canvas-handle" className={Classes.DIVIDER}  />
                <Panel id="canvas" order={3} minSize={minSize(200)}>
                    <div className={`${styles.canvascontainer}`}>
                            <FontPreview project={project} />
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    )
}
