import { OverlayToaster } from "@blueprintjs/core";
import { calculateTemplateData, generateTemplateAseprite, generateTemplatePng } from "../generation/template/template";
import { ProjectData } from "./projectstore";

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

export async function exportTemplate(project: ProjectData, format: TemplateExportFormat) {
    const templateData = calculateTemplateData(project, "force current")
    const image = format === "png"
        ? await generateTemplatePng(templateData)
        : await generateTemplateAseprite(templateData)
    const filename = `${project.name}-template.${format}`

    if (!window["showSaveFilePicker"]) {
        exportTemplateFallback(image, filename)
        return
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

function importTemplateFallback(): Promise<Blob | null> {
    return new Promise(resolve => {
        const input = Object.assign(document.createElement("input"), {
            type: "file",
            accept: ".png",
            style: "display: none",
        })
        input.onchange = () => resolve(input.files && input.files[0])
        document.body.append(input);
        input.click()
    })
}

export async function importTemplate(): Promise<Blob | null> {
    if (!window["showOpenFilePicker"]) {
        return importTemplateFallback()
    }

    const [handle] = await window.showOpenFilePicker({
        types: [{
            description: "PNG",
            accept: { "image/png": [".png"] },
        }],
        excludeAcceptAllOption: true,
        startIn: 'documents',
    })
    return await handle.getFile()
}
