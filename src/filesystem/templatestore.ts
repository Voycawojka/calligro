import { calculateTemplateData, generateTemplateAseprite, generateTemplatePng } from "../generation/template/template";
import { ProjectData } from "./projectstore";
import { FileFilter, getMultiPlatformFileSystem, MultiPlatformFileHandle } from "./access";
import { BrowserFileSystemApiNotAvailable } from "./access/web";
import { showSuccessToast } from "../utils/toasts";

function exportTemplateFallback(image: Blob, filename: string) {
    const url = URL.createObjectURL(image)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

export type TemplateExportFormat = "png" | "aseprite"

export type TemplateExportResult =
    | { status: "cancelled" }
    | { status: "downloaded" }
    | { status: "exported", handle: MultiPlatformFileHandle }

export async function exportTemplate(project: ProjectData, format: TemplateExportFormat): Promise<TemplateExportResult> {
    const templateData = calculateTemplateData(project, "force current")
    const image = format === "png"
        ? await generateTemplatePng(templateData)
        : await generateTemplateAseprite(templateData)
    const filename = `${project.name}-template.${format}`

    const fs = getMultiPlatformFileSystem()
    let handle: MultiPlatformFileHandle | null
    try {
        handle = await fs.showSaveFileDialog(filename, filePickerTypesForExport(format))
    } catch(e) {
        if (e instanceof BrowserFileSystemApiNotAvailable) {
            exportTemplateFallback(image, filename)
            return { status: "downloaded" }
        } else {
            throw e
        }
    }

    if (!handle) {
        return { status: "cancelled" }
    }

    await handle.writeData(image)

    await showSuccessToast(`Exported template: ${await handle.getFileName()}`, "floppy-disk")

    return { status: "exported", handle }
}

function filePickerTypesForExport(format: TemplateExportFormat): FileFilter[] {
    if (format === "png") {
        return [{
            name: 'PNG',
            mimeType: 'image/png',
            extensions: ['png']
        }]
    } else {
        return [{
            name: 'Aseprite',
            mimeType: 'image/x-aseprite',
            extensions: ['aseprite', 'ase']
        }]
    }
}

export interface ImportedTemplateFile {
    image: File,
    handle: MultiPlatformFileHandle | null,
}

export type TemplateImportResult =
    | { status: "cancelled" }
    | { status: "imported", file: ImportedTemplateFile }

function importTemplateFileFallback(): Promise<TemplateImportResult> {
    return new Promise(resolve => {
        const input = Object.assign(document.createElement("input"), {
            type: "file",
            accept: ".png, .aseprite, .ase",
            style: "display: none",
        })
        input.onchange = () => resolve(input.files?.[0]
            ? { status: "imported", file: { image: input.files[0], handle: null } }
            : { status: "cancelled" })
        input.oncancel = () => resolve({ status: "cancelled" })
        document.body.append(input);
        input.click()
    })
}

export async function importTemplateFile(): Promise<TemplateImportResult> {
    const fs = getMultiPlatformFileSystem()

    let handle: MultiPlatformFileHandle | null
    try {
        handle = await fs.showOpenFileDialog([
            {
                name: "PNG",
                mimeType: "image/png",
                extensions: ["png"],
            },
            {
                name: "Aseprite",
                mimeType: "image/x-aseprite",
                extensions: [".aseprite", ".ase"]
            },
        ])
    } catch (e) {
        if (e instanceof BrowserFileSystemApiNotAvailable) {
            return importTemplateFileFallback()
        } else {
            throw e
        }
    }

    if (!handle) {
        return { status: "cancelled" }
    }

    return {
        status: "imported",
        file: {
            image: await handle.getFile(),
            handle,
        },
    }
}
