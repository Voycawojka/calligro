import { OverlayToaster } from "@blueprintjs/core";
import { calculateTemplateData, generateTemplateAseprite, generateTemplatePng } from "../generation/template/template";
import { ProjectData } from "./projectstore";
import { getMultiPlatformFileSystem, MultiPlatformFileHandle } from "./access";
import { BrowserFileSystemApiNotAvailable } from "./access/web";

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

export async function exportTemplate(project: ProjectData, format: TemplateExportFormat): Promise<FileSystemFileHandle | null> {
    const templateData = calculateTemplateData(project, "force current")
    const image = format === "png"
        ? await generateTemplatePng(templateData)
        : await generateTemplateAseprite(templateData)
    const filename = `${project.name}-template.${format}`

    if (!window["showSaveFilePicker"]) {
        exportTemplateFallback(image, filename)
        return null
    }

    const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        startIn: 'documents',
        types: filePickerTypes(format),
    })
    const writable = await handle.createWritable()

    await writable.write(image)
    await writable.close()

    const toaster = await OverlayToaster.create({ position: "top-right" })
    toaster.show({
        icon: "floppy-disk",
        intent: "success",
        message: `Exported template: ${handle.name}`
    })

    return handle
}

function filePickerTypes(format: TemplateExportFormat): FilePickerAcceptType[] {
    if (format === "png") {
        return [{
            description: 'PNG',
            accept: { "image/png": ['.png'] }
        }]
    } else {
        return [{
            description: 'Aseprite',
            accept: { "image/x-aseprite": ['.aseprite', '.ase'] }
        }]
    }
}

export interface ImportedTemplateFile {
    image: File,
    handle: MultiPlatformFileHandle | null,
}

function importTemplateFileFallback(): Promise<ImportedTemplateFile | null> {
    return new Promise(resolve => {
        const input = Object.assign(document.createElement("input"), {
            type: "file",
            accept: ".png, .aseprite, .ase",
            style: "display: none",
        })
        input.onchange = () => resolve(input.files && { image: input.files[0], handle: null })
        document.body.append(input);
        input.click()
    })
}

export async function importTemplateFile(): Promise<ImportedTemplateFile | null> {
    const fs = getMultiPlatformFileSystem()

    try {
        const handle = await fs.showOpenFileDialog([
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
        if (!handle) {
            throw new Error("No file chosen")
        }
        return {
            image: await handle.getFile(),
            handle
        }
    } catch (e) {
        if (e instanceof BrowserFileSystemApiNotAvailable) {
            return importTemplateFileFallback()
        } else {
            throw e
        }
    }
}
