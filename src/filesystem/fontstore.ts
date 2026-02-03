import { generateFont } from "../generation/font/font";
import { fontSpecToTextFile } from "../generation/font/specSaver";
import { downloadArchive, ZippedFile } from "../generation/fs/zip";
import { calculateTemplateData, generateTemplatePng } from "../generation/template/template";
import { ProjectData } from "./projectstore";

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
    fntHandle: FileSystemFileHandle,
    pngHandle: FileSystemFileHandle,
}

export async function saveFontWithPicker(project: ProjectData, format: "txt" | "xml"): Promise<ExportHandles | null> {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplatePng(templateData)
    const [spec, [page]] = await generateFont(templateData, templateImage)
    const fntName = `${project.name}.fnt`
    const pageName = `${project.name}.png`
    const fnt = fontSpecToTextFile(spec, format, pageName)

    if (!window["showDirectoryPicker"]) {
        await saveFontFallback(fnt, page, fntName, pageName)
        return null
    }

    const dir = await window.showDirectoryPicker({ mode: "readwrite" })
    const pngHandle = await dir.getFileHandle(pageName, { create: true })
    const fntHandle = await dir.getFileHandle(fntName, { create: true })

    const pngStream = await pngHandle.createWritable()
    await pngStream.write(page)
    await pngStream.close()

    const fntStream = await fntHandle.createWritable()
    await fntStream.write(fnt)
    await fntStream.close()

    return { fntHandle, pngHandle }
}

export async function saveFontWithHandles(project: ProjectData, format: "txt" | "xml", handles: ExportHandles) {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplatePng(templateData)
    const [spec, [page]] = await generateFont(templateData, templateImage)
    const pageName = `${project.name}.png`
    const fnt = fontSpecToTextFile(spec, format, pageName)

    const pngStream = await handles.pngHandle.createWritable()
    await pngStream.write(page)
    await pngStream.close()

    const fntStream = await handles.fntHandle.createWritable()
    await fntStream.write(fnt)
    await fntStream.close()
}
