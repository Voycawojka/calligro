import React from 'react'
import { isElectron } from '../../electron/electronInterop'

interface DesktopOnlyProps {
    div?: boolean
    children: React.ReactNode
}

export function DesktopOnly(props: DesktopOnlyProps) {
    return isElectron()
        ? props.div
            ? <div>{props.children}</div>
            : <>{props.children}</>
        : null
}
