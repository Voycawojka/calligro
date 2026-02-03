import { ProjectData } from "../../filesystem/projectstore"
import { useEffect, useState, useContext } from "react"
import { ExportHandles, saveFontWithHandles } from "../../filesystem/fontstore"
import { OverlayToaster } from "@blueprintjs/core"
import { ProjectMutContext } from "../contexts/ProjectContext"

export function useQuickReexport(project: ProjectData) {
    const [isAutoExportEnabled, setIsAutoExportEnabled] = useState(false)
    const [autoExportIntervalId, setAutoExportIntervalId] = useState<number | null>(null)
    const { mutateCount } = useContext(ProjectMutContext)
    const displayData = getDisplayData(project)

    const reexport = async (auto: boolean) => {
        if (!displayData.enabled) {
            return
        }

        try {
            await saveFontWithHandles(project, displayData.format, displayData.exportHandles)

            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                intent: "success",
                message: `${auto ? "Changes detected! " : ""}Font reexported.`
            })
        } catch (e: any) {
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "error",
                intent: "danger",
                message: `Couldn't reexport font: ${e.message}`,
            })
            console.error(e)
        }
    }

    useEffect(() => {
        const cleanup = () => {
            if (autoExportIntervalId !== null) {
                clearInterval(autoExportIntervalId)
            }
            setAutoExportIntervalId(null)
        }

        if (!isAutoExportEnabled || !displayData.enabled) {
            cleanup()
        }

        if (autoExportIntervalId === null && isAutoExportEnabled && displayData.enabled) {
            let lastMutateCount: number | null = null
            setAutoExportIntervalId(setInterval(async () => {
                if (isAutoExportEnabled && displayData.enabled) {
                    if (mutateCount !== lastMutateCount) {
                        reexport(true)
                        lastMutateCount = mutateCount
                    }
                }
            }, 150) as unknown as number);
        }

        return cleanup
    }, [isAutoExportEnabled, displayData.enabled, mutateCount])

    useEffect(() => {
        setIsAutoExportEnabled(false)
    }, [project.name])

    return {
        isAutoExportEnabled,
        setIsAutoExportEnabled,
        reexport,
        displayData,
    }
}

export type displayData =
    | { enabled: true, exportHandles: ExportHandles, format: "txt" | "xml" }
    | { enabled: false, reason: string }

function getDisplayData(project: ProjectData): displayData {
    if (project.lastExportedFont?.handles) {
        return {
            enabled: true,
            exportHandles: project.lastExportedFont.handles,
            format: project.lastExportedFont.format,
        }
    }

    if (!window["showOpenFilePicker"]) {
        return { enabled: false, reason: "This function isn't available in your browser" }
    }

    return { enabled: false, reason: "Requires a previous export in the current session" }
}
