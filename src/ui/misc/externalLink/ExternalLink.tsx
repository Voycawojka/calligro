import React, { HTMLProps } from 'react'
import  { openUrl } from '@tauri-apps/plugin-opener'

interface ExternalLinkProps extends HTMLProps<HTMLAnchorElement> {
}

function ExternalLink(props: ExternalLinkProps) {
    if (window.isTauri) {
        const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            if (props.href) {
                event.preventDefault()
                openUrl(props.href)
            }
        }

        return <a {...props} onClick={handleClick}>{props.children}</a>
    }

    return <a {...props}>{props.children}</a>
}

export default ExternalLink
