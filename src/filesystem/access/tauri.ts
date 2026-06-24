import { invoke } from "@tauri-apps/api/core";
import { FileFilter, MultiPlatformDirectoryHandle, MultiPlatformFileHandle, MultiPlatformFileSystem } from "../access";
import { open as openDialog, save as saveDialog } from "@tauri-apps/plugin-dialog";
import { writeFile,  writeTextFile, readFile } from "@tauri-apps/plugin-fs";
import { basename } from "@tauri-apps/api/path"

class DirectoryHandle implements MultiPlatformDirectoryHandle {
    constructor(private path: string) {}

    async getOrCreateFileHandle(name: string): Promise<MultiPlatformFileHandle> {
        return new FileHandle(`${this.path}/${name}`)
    }
}

class FileHandle implements MultiPlatformFileHandle {
    constructor(private path: string) {}

    async writeData(data: Blob): Promise<void> {
        writeFile(this.path, new Uint8Array(await data.arrayBuffer()))
    }

    async writeText(data: string): Promise<void> {
        writeTextFile(this.path, data)
    }

    async getFile(): Promise<File> {
        const uint8Array = await readFile(this.path)
        const [fileName, mimeType] = await this.getFileMetadata()
        return new File([uint8Array], fileName, { type: mimeType })
    }

    getFileName(): Promise<string> {
        return basename(this.path)
    }

    private async getFileMetadata(): Promise<[string, string]> {
        return await invoke('get_file_metadata', { path: this.path })
    }
}

export const fs = {
    showChooseDirDialog: async () => {
        const dirPath = await openDialog({ multiple: false, directory: true });
        return dirPath && new DirectoryHandle(dirPath) || null
    },

    showOpenFileDialog: async (filters: FileFilter[]) => {
        const filePath = await openDialog({ filters, multiple: false });
        return filePath && new FileHandle(filePath) || null
    },

    showSaveFileDialog: async (suggestedName: string, suggestedTypes: FileFilter[]) => {
        const filePath = await saveDialog({ defaultPath: suggestedName, filters: suggestedTypes });
        return filePath && new FileHandle(filePath) || null
    }
} satisfies MultiPlatformFileSystem
