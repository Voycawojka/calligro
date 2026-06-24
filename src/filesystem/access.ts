import { fs as tauriFs } from "./access/tauri"
import { fs as webFs } from "./access/web"

export type FileFilter = {
    name: string
    mimeType: `${string}/${string}`
    extensions: string[]
}

export interface MultiPlatformFileSystem {
    showChooseDirDialog(): Promise<MultiPlatformDirectoryHandle | null>
    showOpenFileDialog(filters: FileFilter[]): Promise<MultiPlatformFileHandle | null>
    showSaveFileDialog(suggestedName: string, suggestedTypes: FileFilter[]): Promise<MultiPlatformFileHandle | null>
}

export interface MultiPlatformDirectoryHandle {
    getOrCreateFileHandle(name: string): Promise<MultiPlatformFileHandle>
}

export interface MultiPlatformFileHandle {
    writeData(data: Blob): Promise<void>
    writeText(data: string): Promise<void>
    getFile(): Promise<File>
    getFileName(): Promise<string>
}

export function getMultiPlatformFileSystem(): MultiPlatformFileSystem {
    return window.isTauri ? tauriFs : webFs
}
