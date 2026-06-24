import { FileFilter, MultiPlatformDirectoryHandle, MultiPlatformFileHandle, MultiPlatformFileSystem } from "../access";

export class BrowserFileSystemApiNotAvailable extends Error {}

class DirectoryHandle implements MultiPlatformDirectoryHandle {
    constructor(private nativeHandle: FileSystemDirectoryHandle) {}

    async getOrCreateFileHandle(name: string): Promise<MultiPlatformFileHandle> {
        const nativeFileHandle = await this.nativeHandle.getFileHandle(name, { create: true });
        return new FileHandle(nativeFileHandle);
    }
}

class FileHandle implements MultiPlatformFileHandle {
    constructor(private nativeHandle: FileSystemFileHandle) {}

    async writeData(data: Blob): Promise<void> {
        const pngStream = await this.nativeHandle.createWritable()
        await pngStream.write(data)
        await pngStream.close()
    }

    async writeText(data: string): Promise<void> {
        const pngStream = await this.nativeHandle.createWritable()
        await pngStream.write(data)
        await pngStream.close()
    }

    getFile(): Promise<File> {
        return this.nativeHandle.getFile()
    }

    async getFileName(): Promise<string> {
        return this.nativeHandle.name
    }
}

export const fs = {
    showChooseDirDialog: async () => {
        if (!window["showDirectoryPicker"]) {
            throw new BrowserFileSystemApiNotAvailable();
        }

        const nativeHandle = await window.showDirectoryPicker({ mode: "readwrite" });
        return new DirectoryHandle(nativeHandle);
    },

    showOpenFileDialog: async (filters: FileFilter[]) => {
        if (!window["showOpenFilePicker"]) {
            throw new BrowserFileSystemApiNotAvailable();
        }

        const [nativeHandle] = await window.showOpenFilePicker({
            types: filters.map(({ name, mimeType, extensions }) => ({
                description: name,
                accept: { [mimeType]: extensions.map(ext => `.${ext}` satisfies `.${string}`) }
            })),
            excludeAcceptAllOption: true,
            startIn: 'documents',
        });
        return new FileHandle(nativeHandle);
    },

    showSaveFileDialog: async (suggestedName: string, suggestedTypes: FileFilter[]) => {
        if (!window["showSaveFilePicker"]) {
            throw new BrowserFileSystemApiNotAvailable();
        }

        const nativeHandle = await window.showSaveFilePicker({
            suggestedName,
            types: suggestedTypes.map(({ name, mimeType, extensions }) => ({
                description: name,
                accept: { [mimeType]: extensions.map(ext => `.${ext}` satisfies `.${string}`) }
            })),
            startIn: 'documents',
        })
        return new FileHandle(nativeHandle)
    }
} satisfies MultiPlatformFileSystem
