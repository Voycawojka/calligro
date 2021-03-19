import { CodePayload } from './types'

export function parseTemplateCode(code: string): CodePayload | null {
    try {
        const json = decodeURIComponent(escape(atob(code)))
        const codePayload: CodePayload = JSON.parse(json)

        switch (codePayload.version) {
            case 0:
                codePayload.presetName = 'custom'
                break
            case 1:
                break
            default:
                throw new Error(`Only templates version '0' and '1' are supported, instead got version '${codePayload.version}'`)
        }

        if (typeof codePayload.presetName !== 'string') {
            throw new Error(`Property 'presetName' must be a string, instead got: ${typeof codePayload.presetName} '${codePayload.presetName}'`)
        }

        if (!Number.isInteger(codePayload.base)) {
            throw new Error(`Property 'base' must be an integer, instead got: ${typeof codePayload.base} '${codePayload.base}'`)
        }

        if (!Array.isArray(codePayload.slots)) {
            throw new Error(`Property 'slots' must be an array, instead got: ${codePayload.slots} '${codePayload.slots}'`)
        }

        const incorrectSlot = codePayload.slots.find(slot => !Array.isArray(slot) || slot.length !== 3 || slot.find(value => !Number.isInteger(value)))
        if (incorrectSlot) {
            throw new Error(`Each slot must be a three element array (integers only). Instead found: ${JSON.stringify(incorrectSlot)}`)
        }

        return codePayload
    } catch (e) {
        console.warn(`Invalid template code provided: ${e.message}`)
        return null
    }
}
