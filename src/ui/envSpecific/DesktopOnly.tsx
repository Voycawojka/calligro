import React from 'react'

interface DesktopOnlyProps {
    div?: boolean
    children: React.ReactNode
}

export function DesktopOnly(props: DesktopOnlyProps) {
    return window.isTauri
        ? props.div
            ? <div>{props.children}</div>
            : <>{props.children}</>
        : null
}
