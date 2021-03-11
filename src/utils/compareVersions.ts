type compareOutput = 'greater' | 'lesser' | 'equal'

export function compareVersions(version1: string, version2: string): compareOutput {
    const [major1, minor1, patch1] = version1.split('.').map(v => Number.parseInt(v))
    const [major2, minor2, patch2] = version2.split('.').map(v => Number.parseInt(v))

    const majorDiff = compare(major1, major2)

    if (majorDiff !== 'equal') {
        return majorDiff
    }

    const minorDiff = compare(minor1, minor2)

    if (minorDiff !== 'equal') {
        return minorDiff
    }

    return compare(patch1, patch2)
}

function compare(a: number, b: number): compareOutput {
    if (a > b) {
        return 'greater'
    }

    if (a < b) {
        return 'lesser'
    }

    return 'equal'
}