import { Button, OverlayToaster, Tooltip } from "@blueprintjs/core"
import { Icon } from "@blueprintjs/core"
import { ProjectData } from "../../filesystem/projectstore"
import { useContext } from "react"
import { ProjectLoadContext } from "../contexts/ProjectContext"
import { asepriteToPng } from "../../generation/png/aseprite"

export interface Props {
    project: ProjectData,
}

export default function QuickReimportSection({ project }: Props) {
    const setProjectContext = useContext(ProjectLoadContext)
    const displayData = getDisplayData(project)

    const reimport = async () => {
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
                message: `Template '${displayData.fileHandle.name}' refreshed.`
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

    return (
        <Tooltip content={<div>Reimport last template{!displayData.enabled && <><br />{displayData.reason}</>}</div>} position="bottom">
            <Button 
                disabled={!displayData.enabled} 
                variant="minimal" 
                icon={<Icon icon="refresh" />} 
                onClick={reimport}
            />
        </Tooltip>
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
