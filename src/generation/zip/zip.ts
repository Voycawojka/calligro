import { downloadZip } from 'client-zip'

function downloadBlob(name: string, blob: Blob): void {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = name
    link.click()

    URL.revokeObjectURL(link.href)
    link.remove()
}

export interface ZippedFile {
    name: string
    input: string | Blob
}

export async function downloadArchive(name: string, files: ZippedFile[]): Promise<void> {
    const archive = downloadZip(files)
    const blob = await archive.blob()

    downloadBlob(`${name}.zip`, blob)
}
