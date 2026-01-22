import { Button, ButtonGroup, Checkbox, MenuItem, OverlayToaster, Tooltip } from "@blueprintjs/core"
import { Icon } from "@blueprintjs/core"
import { ProjectData } from "../../filesystem/projectstore"
import { useContext, useEffect, useState } from "react"
import { ProjectLoadContext } from "../contexts/ProjectContext"
import { asepriteToPng } from "../../generation/png/aseprite"
import ToolbarMenu from "./ToolbarMenu"

export interface Props {
    project: ProjectData,
}

export default function QuickReimportSection({ project }: Props) {
    const [isAutoDetectEnabled, setIsAutoDetectEnabled] = useState(false)
    const [autoDetectIntervalId, setAutoDetectIntervalId] = useState<number | null>(null)
    const setProjectContext = useContext(ProjectLoadContext)
    const displayData = getDisplayData(project)

    const reimport = async (auto: boolean) => {
        if (!displayData.enabled) {
            return
        }

        try {
            const templateFile = await displayData.fileHandle.getFile()
            const image = templateFile.type == "image/png" ? templateFile : await asepriteToPng(templateFile)
            const settings = project.lastExportSnapshot ?? project
            setProjectContext({
                ...project,
                importedTemplate: {
                    defaultCharacterWidth: settings.defaultCharacterWidth,
                    defaultCharacterHeight: settings.defaultCharacterHeight,
                    characterBase: settings.characterBase,
                    characterSet: settings.characterSet,
                    image: image,
                    imageBase64: "",
                    fileHandle: displayData.fileHandle,
                },
                dirty: true,
            })

            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                intent: "success",
                message: `${auto ? "Changes detected! " : ""}Template '${displayData.fileHandle.name}' refreshed.`
            })
        } catch (e: any) {
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "error",
                intent: "danger",
                message: `Couldn't reimport "${displayData.fileHandle.name}": ${e.message}`,
            })
            console.error(e)
        }
    }

    useEffect(() => {
        const cleanup = () => {
            if (autoDetectIntervalId !== null) {
                clearInterval(autoDetectIntervalId)
            }
            setAutoDetectIntervalId(null)
        }

        if (!isAutoDetectEnabled || !displayData.enabled) {
            cleanup()
        }

        if (autoDetectIntervalId === null && isAutoDetectEnabled && displayData.enabled) {
            let autoDetectLastModified: number | null = null
            setAutoDetectIntervalId(setInterval(async () => {
                if (isAutoDetectEnabled && displayData.enabled && displayData.fileHandle) {
                    const file = await displayData.fileHandle.getFile()
                    if (autoDetectLastModified === null || file.lastModified > autoDetectLastModified) {
                        reimport(true)
                    }
                    autoDetectLastModified = file.lastModified
                }
            }, 500) as unknown as number);
        }

        return cleanup
    }, [isAutoDetectEnabled, displayData.enabled])

    useEffect(() => {
        setIsAutoDetectEnabled(false)
    }, [project.name])

    return (
            <ButtonGroup>
                <Tooltip content={<div>Reimport last template{!displayData.enabled && <><br />{displayData.reason}</>}</div>} position="bottom">
                    <Button 
                        disabled={!displayData.enabled} 
                        variant="outlined"
                        icon={<Icon icon="refresh" />} 
                        onClick={() => reimport(false)}
                    >
                        Reimport
                    </Button>
                </Tooltip>
                <ToolbarMenu buttonIcon="chevron-down" buttonText="">
                    <MenuItem key="auto-refresh" shouldDismissPopover={false} text={
                        <Checkbox
                            inline
                            style={{ margin: 0 }}
                            checked={isAutoDetectEnabled}
                            onChange={e => setIsAutoDetectEnabled(e.currentTarget.checked)}>
                            Auto detect changes
                        </Checkbox>
                    } />
                </ToolbarMenu> 
            </ButtonGroup>
       
    )
}

type displayData =
    | { enabled: true, fileHandle: FileSystemFileHandle }
    | { enabled: false, reason: string }

function getDisplayData(project: ProjectData): displayData {
    if (project.importedTemplate?.fileHandle) {
        return { enabled: true, fileHandle: project.importedTemplate.fileHandle }
    }

    if (!window["showOpenFilePicker"]) {
        return { enabled: false, reason: "This function isn't available in your browser" }
    }

    return { enabled: false, reason: "Requires a template to be imported manually in the current session first" }
}
