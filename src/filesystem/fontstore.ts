import { generateFont } from "../generation/font/font";
import { fontSpecToTextFile } from "../generation/font/specSaver";
import { downloadArchive, ZippedFile } from "../generation/fs/zip";
import { calculateTemplateData, generateTemplatePng } from "../generation/template/template";
import { ProjectData } from "./projectstore";
import { getMultiPlatformFileSystem, MultiPlatformFileHandle } from "./access";
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

export async function saveFontWithPicker(project: ProjectData, name: string, format: "txt" | "xml"): Promise<ExportHandles | null> {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplatePng(templateData)
    const [spec, [page]] = await generateFont(name, templateData, templateImage)
    const fntName = `${name}.fnt`
    const pageName = `${name}.png`
    const fnt = fontSpecToTextFile(spec, format)

    const fs = getMultiPlatformFileSystem()
    try {
        const dir = await fs.showChooseDirDialog()

        if (!dir) {
            throw new Error("No directory selected")
        }

        const pngHandle = await dir.getOrCreateFileHandle(pageName)
        const fntHandle = await dir.getOrCreateFileHandle(fntName)

        await pngHandle.writeData(page)
        await fntHandle.writeText(fnt)

        return {
            fntHandle: fntHandle,
            pngHandle: pngHandle,
        }
    } catch (e) {
        if (e instanceof BrowserFileSystemApiNotAvailable) {
            await saveFontFallback(fnt, page, fntName, pageName)
            return null
        } else {
            throw e
        }
    }
}

export async function saveFontWithHandles(project: ProjectData, name: string, format: "txt" | "xml", handles: ExportHandles) {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplatePng(templateData)
    const [spec, [page]] = await generateFont(name, templateData, templateImage)
    const fnt = fontSpecToTextFile(spec, format)

    handles.pngHandle.writeData(page)
    handles.fntHandle.writeText(fnt)
}
