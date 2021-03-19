import React from 'react'
import { isElectron } from '../../electron/electronInterop'

interface DesktopOnlyProps {
    div?: Boolean
    children: React.ReactNode
}

export function DesktopOnly(props: DesktopOnlyProps) {
    return isElectron()
        ? props.div
            ? <div>{props.children}</div>
            : <>{props.children}</>
        : null
}
