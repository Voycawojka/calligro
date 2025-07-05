export interface KerningPair {
    first: number
    second: number
    amount: number
}

export interface ProjectData {
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
    lastExportSnapshot: null | {
        defaultCharacterWidth: number
        defaultCharacterHeight: number
        characterBase: number
        characterSet: string
    }
    importedTemplate: null | {
        defaultCharacterWidth: number
        defaultCharacterHeight: number
        characterBase: number
        characterSet: string
        image: Blob
    }
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
        lastExportSnapshot: null,
        importedTemplate: null,
        dirty: false,
    } satisfies ProjectData
    const json = JSON.stringify(emptyProject)
    localStorage.setItem(projectKey, json)

    const projects = getProjectNameArray()
    projects.unshift(name)
    saveProjectNameArray(projects)

    return emptyProject
}

export function saveProject(name: string, data: ProjectData) {
    const projectKey = generareProjectKey(name)
    const json = JSON.stringify(data)
    
    localStorage.setItem(projectKey, json)

    const projects = getProjectNameArray()
    if (!projects.includes(name)) {
        projects.unshift(name)
        saveProjectNameArray(projects)
    }
}

export function loadProject(name: string): ProjectData | undefined {
    const projectKey = generareProjectKey(name)
    const json = localStorage.getItem(projectKey)
    return json && JSON.parse(json)
}

export function listProjectNames(max: number | undefined): string[] {
    const projects = getProjectNameArray()
    return projects.slice(0, max)
}
