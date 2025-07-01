import { downloadArchive, ZippedFile } from '../fs/zip'
import Template from './template'

export async function downloadTemplate(template: Template): Promise<void> {
    const files: ZippedFile[] = [
        {
            name: 'template.png',
            input: await template.generateImageBlob()
        },
        {
            name: 'template.calligro',
            input: template.generateTemplateCode()
        },
        {
            name: 'readme.txt',
            input: template.readmeContent
        }
    ]

    return downloadArchive('calligro-template', files)
}
