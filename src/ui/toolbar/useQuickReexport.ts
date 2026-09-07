import { ProjectData } from "../../filesystem/projectstore"
import {  useContext } from "react"
import { ExportHandles, saveFontWithHandles } from "../../filesystem/fontstore"
import { ProjectContext } from "../contexts/ProjectContext"
import { isFilePickingSupported } from "../../filesystem/access"
import { showErrorToast, showSuccessToast } from "../../utils/toasts"

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
            await saveFontWithHandles(project, displayData.name, displayData.format, displayData.exportHandles)
            await showSuccessToast("Font reexported.")
        } catch (e: any) {
            await showErrorToast(e, "Couldn't reexport font")
        }
    }

    return {
        reexport,
        displayData,
    }
}

export type displayData =
    | { enabled: true, exportHandles: ExportHandles, format: "txt" | "xml", name: string }
    | { enabled: false, reason: string }

function getDisplayData(project: ProjectData): displayData {
    if (project.lastExportedFont?.handles) {
        return {
            enabled: true,
            exportHandles: project.lastExportedFont.handles,
            format: project.lastExportedFont.format,
            name: project.lastExportedFont.name,
        }
    }

    if (!isFilePickingSupported()) {
        return { enabled: false, reason: "This function isn't available in your browser" }
    }

    return { enabled: false, reason: "Requires a previous export in the current session" }
}
