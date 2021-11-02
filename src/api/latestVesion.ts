import { compareVersions } from "../utils/compareVersions"

interface GithubReleaseData {
    name: string
    body: string
}

interface ItchReleaseData {
    latest: string
}

function fetchLatestItchVersion(channelName: string): Promise<ItchReleaseData> {
    return fetch(`https://itch.io/api/1/x/wharf/latest?target=voycawojka/calligro&channel_name=${channelName}`)
        .then(response => response.json())
        .then(data => {
            if (data.errors) {
                throw new Error(`Cannot fetch latest version information [${data.errors.join(', ')}]`)
            }

            return data as ItchReleaseData
        })
}

function fetchGithubVersionDetails(version: string): Promise<GithubReleaseData> {
    const tag = compareVersions(version, '0.2.0') === 'greater'
        ? `v${version}`
        : `v.${version}`

    return fetch(`https://api.github.com/repos/voycawojka/calligro/releases/tags/${tag}`)
        .then(response => response.json())
}

export type NewVersionData = { type: 'up_to_date' } | { type: 'new_available', name: string, body: string, version: string }

export async function fetchNewerVersion(currentVersion: string, currentChannel: string): Promise<NewVersionData> {
    try {
        const itchVersion = await fetchLatestItchVersion(currentChannel)

        if (compareVersions(currentVersion, itchVersion.latest) !== 'lesser') {
            return { type: 'up_to_date' }
        }

        const githubRelease = await fetchGithubVersionDetails(itchVersion.latest)

        return {
            type: 'new_available',
            name: githubRelease.name,
            body: githubRelease.body,
            version: itchVersion.latest
        }
    } catch (e) {
        console.error(`Error while checking for a newer version`, e)
        return { type: 'up_to_date' }
    }
}
