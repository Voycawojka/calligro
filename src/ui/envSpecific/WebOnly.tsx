import React from 'react'
import { isElectron } from '../../electron/electronInterop'

interface WebOnlyProps {
    div?: boolean
    children: React.ReactNode
}

export function WebOnly(props: WebOnlyProps) {
    return isElectron()
        ? null
        : props.div
            ? <div>{props.children}</div>
            : <>{props.children}</>
}
