interface SavedLastExportSnapshot {
    defaultCharacterWidth: number
    defaultCharacterHeight: number
    characterBase: number
    characterSet: string
    format: "png" | "aseprite" | undefined
}

interface SavedImportedTemplate {
    defaultCharacterWidth: number
    defaultCharacterHeight: number
    characterBase: number
    characterSet: string
    imageBase64: string
}

export interface KerningPair {
    first: number
    second: number
    amount: number
}

export interface SizeOverride {
    char: number
    width: number
    height: number
}

interface SavedProjectData {
    name: string
    createdAt: number
    defaultCharacterWidth: number
    defaultCharacterHeight: number
    characterBase: number
    characterSet: string
    prefill: string | null
    prefillColor: string
    prefillOutline: number
    prefillOutlineColor: string
    horizontalSpacing: number
    verticalSpacing: number
    lineHeight: number
    kernings: KerningPair[]
    sizeOverrides: SizeOverride[]
    previewText: string
    previewScale: number
    previewBgColor: string
    lastExportSnapshot: null | SavedLastExportSnapshot
    importedTemplate: null | SavedImportedTemplate
}

export interface ImportedTemplate extends SavedImportedTemplate {
    image: Blob
    fileHandle: FileSystemFileHandle | null
}

export interface ProjectData extends SavedProjectData {
    importedTemplate: null | ImportedTemplate
    dirty: boolean
}

const INTERNAL_PROJECT_ARRAY = "_internal_project_array"

function getProjectNameArray(): string[] {
    const json = localStorage.getItem(INTERNAL_PROJECT_ARRAY)
    return json ? JSON.parse(json) : []
}

function saveProjectNameArray(array: string[]) {
    const json = JSON.stringify(array)
    localStorage.setItem(INTERNAL_PROJECT_ARRAY, json)
}

function generareProjectKey(name: String): string {
    return `_project:${name}`
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve((reader.result as string).split(",")[1])
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

function base64ToBlob(base64: string): Blob {
    const binary = atob(base64)
    const array = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i)
    }
    return new Blob([array], { type: "image/png"})
}

function savedToExported(data: SavedProjectData): ProjectData {
    return {
        ...data,
        importedTemplate: data.importedTemplate === null ? null : {
            ...data.importedTemplate,
            image: base64ToBlob(data.importedTemplate.imageBase64),
            fileHandle: null,
        },
        dirty: false,
    }
}

async function exportedToSaved(data: ProjectData): Promise<SavedProjectData> {
    const saved: SavedProjectData = {
        ...data,
    }
    delete (saved as any).dirty
    if (saved.importedTemplate) {
        saved.importedTemplate.imageBase64 = await blobToBase64((saved.importedTemplate as ImportedTemplate).image)
        delete (saved.importedTemplate as any).image
    }
    return saved
}

export function newProject(name: string): ProjectData {
    const projectKey = generareProjectKey(name)

    if (localStorage.getItem(projectKey)) {
        throw new Error(`Project '${name}' already exists`)
    }

    const emptyProject = {
        name,
        createdAt: Date.now(),
        defaultCharacterWidth: 30,
        defaultCharacterHeight: 30,
        characterBase: 20,
        characterSet: " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
        prefill: null,
        prefillColor: "#000000",
        prefillOutline: 0,
        prefillOutlineColor: "#000000",
        horizontalSpacing: 0,
        verticalSpacing: 0,
        lineHeight: 35,
        kernings: [],
        sizeOverrides: [],
        previewText: "Just a sample text",
        previewScale: 1,
        previewBgColor: "#ffffff",
        lastExportSnapshot: null,
        importedTemplate: null,
    } satisfies SavedProjectData
    const json = JSON.stringify(emptyProject)
    localStorage.setItem(projectKey, json)

    const projects = getProjectNameArray()
    projects.unshift(name)
    saveProjectNameArray(projects)

    return savedToExported(emptyProject)
}

export async function saveProject(name: string, data: ProjectData) {
    const projectKey = generareProjectKey(name)
    const json = JSON.stringify(await exportedToSaved(data))
    
    localStorage.setItem(projectKey, json)

    const projects = getProjectNameArray()
    if (!projects.includes(name)) {
        projects.unshift(name)
        saveProjectNameArray(projects)
    }
}

export function loadProject(name: string): ProjectData | null {
    const projectKey = generareProjectKey(name)
    const json = localStorage.getItem(projectKey)
    return json === null ? null : savedToExported(JSON.parse(json))
}

export function listProjectNames(max: number | undefined): string[] {
    const projects = getProjectNameArray()
    return projects.slice(0, max)
}

export function removeProject(name: string) {
    const projectKey = generareProjectKey(name)
    const projects = getProjectNameArray().filter(n => n !== name)

    localStorage.removeItem(projectKey)
    saveProjectNameArray(projects)
}
