import { generateFont } from "../generation/font/font";
import { fontSpecToTextFile } from "../generation/font/specSaver";
import { downloadArchive, ZippedFile } from "../generation/fs/zip";
import { calculateTemplateData, generateTemplateImage } from "../generation/template/template";
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

export async function saveFont(project: ProjectData, format: "txt" | "xml") {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplateImage(templateData)
    const [spec, [page]] = await generateFont(templateData, templateImage)
    const fntName = `${project.name}.fnt`
    const pageName = `${project.name}.png`
    const fnt = fontSpecToTextFile(spec, format, pageName)

    if (!window["showDirectoryPicker"]) {
        await saveFontFallback(fnt, page, fntName, pageName)
        return
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
}
