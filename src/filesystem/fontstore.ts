import { generateFont } from "../generation/font/font";
import { fontSpecToTextFile } from "../generation/font/specSaver";
import { downloadArchive, ZippedFile } from "../generation/fs/zip";
import { calculateTemplateData, generateTemplatePng } from "../generation/template/template";
import { ProjectData } from "./projectstore";
import { getMultiPlatformFileSystem, MultiPlatformDirectoryHandle, MultiPlatformFileHandle } from "./access";
import { BrowserFileSystemApiNotAvailable } from "./access/web";

async function saveFontFallback(fnt: string, page: Blob, fntName: string, pageName: string) {
    const files: ZippedFile[] = [
        {
            name: fntName,
            input: fnt,
        },
        {
            name: pageName,
            input: page,
        }
    ]

    return downloadArchive(fntName, files)
}

export type ExportHandles = {
    fntHandle: MultiPlatformFileHandle,
    pngHandle: MultiPlatformFileHandle,
}

export type FontExportResult =
    | { status: "cancelled" }
    | { status: "downloaded" }
    | { status: "exported", handles: ExportHandles }

export async function saveFontWithPicker(project: ProjectData, name: string, format: "txt" | "xml"): Promise<FontExportResult> {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplatePng(templateData)
    const [spec, [page]] = await generateFont(name, templateData, templateImage)
    const fntName = `${name}.fnt`
    const pageName = `${name}.png`
    const fnt = fontSpecToTextFile(spec, format)

    const fs = getMultiPlatformFileSystem()
    let dir: MultiPlatformDirectoryHandle | null
    try {
        dir = await fs.showChooseDirDialog()
    } catch (e) {
        if (e instanceof BrowserFileSystemApiNotAvailable) {
            await saveFontFallback(fnt, page, fntName, pageName)
            return { status: "downloaded" }
        } else {
            throw e
        }
    }

    if (!dir) {
        return { status: "cancelled" }
    }

    const pngHandle = await dir.getOrCreateFileHandle(pageName)
    const fntHandle = await dir.getOrCreateFileHandle(fntName)

    await pngHandle.writeData(page)
    await fntHandle.writeText(fnt)

    return {
        status: "exported",
        handles: {
            fntHandle: fntHandle,
            pngHandle: pngHandle,
        },
    }
}

export async function saveFontWithHandles(project: ProjectData, name: string, format: "txt" | "xml", handles: ExportHandles) {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplatePng(templateData)
    const [spec, [page]] = await generateFont(name, templateData, templateImage)
    const fnt = fontSpecToTextFile(spec, format)

    await handles.pngHandle.writeData(page)
    await handles.fntHandle.writeText(fnt)
}
