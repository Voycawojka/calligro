import React from 'react'

interface WebOnlyProps {
    div?: boolean
    children: React.ReactNode
}

export function WebOnly(props: WebOnlyProps) {
    return window.isTauri
        ? null
        : props.div
            ? <div>{props.children}</div>
            : <>{props.children}</>
}
