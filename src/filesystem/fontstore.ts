import { generateFont } from "../generation/font/font";
import { fontSpecToTextFile } from "../generation/font/specSaver";
import { downloadArchive, ZippedFile } from "../generation/fs/zip";
import { calculateTemplateData, generateTemplatePng } from "../generation/template/template";
import { ProjectData } from "./projectstore";
import { open } from "@tauri-apps/plugin-dialog";
import {writeFile,  writeTextFile } from "@tauri-apps/plugin-fs";

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
    type: "web",
    fntHandle: FileSystemFileHandle,
    pngHandle: FileSystemFileHandle,
} | {
    type: "tauri",
    fntHandle: string,
    pngHandle: string,
}

async function saveFontTauri(fnt: string, page: Blob, fntName: string, pageName: string): Promise<ExportHandles> {
    const dir = await open({ multiple: false, directory: true })

    if (!dir) {
        throw new Error("No directory selected")
    }

    const pngPath = `${dir}/${pageName}`
    const fntPath = `${dir}/${fntName}`

    await writeFile(pngPath, new Uint8Array(await page.arrayBuffer()))
    await writeTextFile(fntPath, fnt)
    
    return {
        type: "tauri",
        fntHandle: fntPath,
        pngHandle: pngPath,
    }
}

async function saveFontWeb(fnt: string, page: Blob, fntName: string, pageName: string): Promise<ExportHandles | null> {
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

    return { type: "web", fntHandle, pngHandle }
}

export async function saveFontWithPicker(project: ProjectData, format: "txt" | "xml"): Promise<ExportHandles | null> {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplatePng(templateData)
    const [spec, [page]] = await generateFont(templateData, templateImage)
    const fntName = `${project.name}.fnt`
    const pageName = `${project.name}.png`
    const fnt = fontSpecToTextFile(spec, format, pageName)

    if (window.isTauri) {
        return saveFontTauri(fnt, page, fntName, pageName)
    }

    return saveFontWeb(fnt, page, fntName, pageName)
}

export async function saveFontWithHandles(project: ProjectData, format: "txt" | "xml", handles: ExportHandles) {
    const templateData = calculateTemplateData(project, "current or imported")
    const templateImage = await generateTemplatePng(templateData)
    const [spec, [page]] = await generateFont(templateData, templateImage)
    const pageName = `${project.name}.png`
    const fnt = fontSpecToTextFile(spec, format, pageName)

    if (handles.type === "web") {
        const pngStream = await handles.pngHandle.createWritable()
        await pngStream.write(page)
        await pngStream.close()

        const fntStream = await handles.fntHandle.createWritable()
        await fntStream.write(fnt)
        await fntStream.close()
    } else if (handles.type === "tauri") {
        await writeFile(handles.pngHandle, new Uint8Array(await page.arrayBuffer()))
        await writeTextFile(handles.fntHandle, fnt)
    }
}
