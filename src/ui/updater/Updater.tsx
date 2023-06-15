import { Component } from 'react'
import { fetchNewerVersion } from '../../api/latestVesion'
import Popup from '../popup/Popup'
import styles from './updater.module.scss'
import ExternalLink from '../misc/externalLink/ExternalLink'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null

interface VersionListenerData {
    version: string
    platform: string
}

interface UpdaterState {
    newVersionName?: string
    newVersionDescription?: string,
    currentVersion?: string,
    newVersionCount?: string
    versionListener?: (event: any, data: VersionListenerData) => Promise<void>
}

interface UpdaterProps {
}

export class Updater extends Component<UpdaterProps, UpdaterState> {

    constructor(props: UpdaterProps) {
        super(props)

        this.state = {}
    }

    componentDidMount() {
        if (ipcRenderer) {
            const listener = (_event: any, data: VersionListenerData) => this.versionListener(data)

            ipcRenderer.on('version', listener)
            ipcRenderer.send('request-version')

            this.setState({
                versionListener: listener
            })
        }
    }

    componentWillUnmount() {
        if (this.state.versionListener) {
            ipcRenderer?.removeListener('version', this.state.versionListener)
        }
    }

    async versionListener(data: VersionListenerData) {
        let channel = null

        if (data.platform === 'linux') {
            channel = 'linux'
        }

        if (data.platform === 'win32') {
            channel = 'win-64'
        }

        if (channel) {
            const newVersion = await fetchNewerVersion(data.version, channel)

            if (newVersion.type === 'new_available') {
                this.setState({
                    newVersionName: newVersion.name,
                    newVersionDescription: newVersion.body,
                    newVersionCount: newVersion.version,
                    currentVersion: data.version
                })
            }
        }
    }

    close() {
        this.setState({
            newVersionName: undefined
        })
    }

    render() {
        if (this.state.newVersionName) {
            const description = this.state.newVersionDescription?.split('\n')
                .map((item, index ) => <p key={index} className={styles.descriptionParagraph}>{item}</p>)

            return (
                <Popup title='New version available' closeHandler={() => this.close()}>
                    <div className={styles.container}>
                        <div className={styles.content}>Version 
                            <span className={styles.contentBold}> {this.state.newVersionCount} </span> 
                            available (your version: <span className={styles.contentBold}>{this.state.currentVersion}</span>)
                        </div>
                        <div className={styles.content}>
                            Name:
                            <span className={styles.contentBold}> {this.state.newVersionName}</span>
                        </div>
                        <ExternalLink className={styles.link} href='https://voycawojka.itch.io/calligro'>Download from itch.io</ExternalLink>
                        <div className={styles.content}>Changelog:</div>
                        <div>{description}</div>
                    </div>
                </Popup>
            )
        }

        return null
    }
}
