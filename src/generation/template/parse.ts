import { CodePayload } from './types'

export function parseTemplateCode(code: string): CodePayload | null {
    try {
        const json = decodeURIComponent(escape(atob(code)))
        const codePayload: CodePayload = JSON.parse(json)

        if (codePayload.version !== 0) {
            throw new Error(`Only templates version '0' are supported, instead got version '${codePayload.version}'`)
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
