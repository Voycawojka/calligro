import { useEffect, useState } from "react"
import { fetchNewerVersion } from "../../api/latestVesion"
import localVersion from "../../../version.txt?raw"
import { isElectron } from "../../electron/electronInterop"

export interface UpdaterInfo {
    newVersionName: string
    newVersionDescription: string
    currentVersion: string
    newVersion: string
}

export function useUpdater(): [boolean, UpdaterInfo | null] {
    const [hasUpdate, setHasUpdate] = useState(false)
    const [info, setInfo] = useState<UpdaterInfo | null>(null)

    useEffect(() => {
        if (!isElectron()) {
            return
        }

        const check = async () => {
            const channel = window.navigator.userAgent.includes("Windows") ? "win-64" : "linux"
            const newVersion = await fetchNewerVersion(localVersion.trim(), channel)
            if (newVersion.type === "new_available") {
                setInfo({
                    newVersion: newVersion.version,
                    newVersionName: newVersion.name,
                    newVersionDescription: newVersion.body,
                    currentVersion: localVersion.trim()
                })
                setHasUpdate(true)
            } else {
                setHasUpdate(false)
            }
        }
        check()
    }, [])

    return [hasUpdate, info]
}
