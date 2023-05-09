import React, { Component } from 'react'
import styles from './aboutPopup.module.scss'

import { bind } from 'helpful-decorators'
import Popup from '../popup/Popup'
import Authors from '../authors/Authors'
import ExternalLink from '../misc/externalLink/ExternalLink'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null

interface AboutPopupState {
    active: boolean
    version: string
}

class AboutPopup extends Component<{}, AboutPopupState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            active: false,
            version: ''
        }
    }

    componentDidMount() {
        ipcRenderer?.on('about-popup', (event, version: string) => {
            this.setState({
                active: true,
                version: version
            })
        })
    }

    componentWillUnmount() {
        ipcRenderer?.removeListener('about-popup', () => {})
    }

    @bind
    closeWindow() {
        this.setState({
            active: false
        })
    }

    render () {
        if (this.state.active) {
            return (
                <Popup title='About' closeHandler={this.closeWindow}>
                    <div className={styles.container}>
                        <div className={styles.disclaimer}>
                            <p className={styles.paragraph}>Calligro lets you generate custom fonts from images created in graphics software like Gimp, Photoshop, Aseprite and others.</p>
                            <p className={styles.paragraph}>
                                This tool can also be used to convert a trutype font into a BMFont (with the prefill option) but if you’re looking specifically for that try tools like the original{' '}
                                <ExternalLink href='https://www.angelcode.com/products/bmfont/' className={styles.link}>BMFont</ExternalLink> 
                                {' '}or{' '} 
                                <ExternalLink href='https://libgdx.com/wiki/tools/hiero' className={styles.link}>Hiero</ExternalLink>
                                {' '}instead.
                            </p>
                        </div>
                        <div className={styles.version}>Version: {this.state.version}</div>
                        <div className={styles.authorsContainer}>
                            <Authors/>
                        </div>
                    </div>
                </Popup>
            )
        } else {
            return null
        }
    }
}

export default AboutPopup
