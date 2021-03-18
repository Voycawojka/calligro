import React, { HTMLProps } from 'react'
import { isElectron } from '../../../electron/electronInterop'

const shell = !!window.require ? window.require('electron').shell : null

interface ExternalLinkProps extends HTMLProps<HTMLAnchorElement> {
}

function ExternalLink(props: ExternalLinkProps) {
    if (isElectron()) {
        const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            if (props.href) {
                event.preventDefault()
                shell?.openExternal(props.href)
            }
        }

        return <a {...props} onClick={handleClick}>{props.children}</a>
    }

    return <a {...props}>{props.children}</a>
}

export default ExternalLink
