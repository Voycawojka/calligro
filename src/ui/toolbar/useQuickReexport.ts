import { ProjectData } from "../../filesystem/projectstore"
import {  useContext } from "react"
import { ExportHandles, saveFontWithHandles } from "../../filesystem/fontstore"
import { OverlayToaster } from "@blueprintjs/core"
import { ProjectContext } from "../contexts/ProjectContext"

export function useQuickReexport() {
    const project = useContext(ProjectContext)

    if (!project) {
        throw new Error("Unexpected error occured! ProjectContext is null in useQuickReexport.")
    }

    const displayData = getDisplayData(project)

    const reexport = async () => {
        if (!displayData.enabled) {
            return
        }

        try {
            await saveFontWithHandles(project, displayData.format, displayData.exportHandles)

            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                intent: "success",
                message: "Font reexported.",
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

    return {
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
