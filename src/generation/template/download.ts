import { downloadArchive, ZippedFile } from "../fs/zip";
import Template from "./Template";

export async function downloadTemplate(template: Template): Promise<void> {
    const files: ZippedFile[] = [
        {
            name: 'template.png',
            input: await template.generateImageBlob()
        },
        {
            name: 'template code.txt',
            input: template.generateTemplateCode()
        }
    ]

    return downloadArchive('calligro-template', files)
}
