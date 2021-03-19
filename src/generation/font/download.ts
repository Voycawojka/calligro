import { downloadArchive, ZippedFile } from '../fs/zip'

export async function downloadBmf(fntFile: string, pages: Blob[]): Promise<void> {
    const files: ZippedFile[] = [
        {
            name: 'calligro-font.fnt',
            input: fntFile
        },
        ...pages.map((page, i) => ({
            name: `calligro-page-${i}.png`,
            input: page
        }))
    ]

    return downloadArchive('calligro-font', files)
}
