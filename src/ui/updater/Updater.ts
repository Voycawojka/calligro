import { Component } from 'react'
import { bind } from 'helpful-decorators'
import { fetchNewerVersion } from '../../api/latestVesion'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null

interface UpdaterState {
    newVersionName?: string
    newVersionDescription?: string
}

interface UpdaterProps {
}

export class Updater extends Component<UpdaterProps, UpdaterState> {

    constructor(props: UpdaterProps) {
        super(props)

        this.state = {}
    }

    componentDidMount() {
        ipcRenderer?.on('version', this.versionListener)
        ipcRenderer?.send('request-version')
    }

    componentWillUnmount() {
        ipcRenderer?.removeListener('version', this.versionListener)
    }

    @bind
    async versionListener(_event: any, data: { version: string, platform: string }) {
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
                    newVersionDescription: newVersion.body
                })

                console.log(newVersion.name)
                console.log(newVersion.body)
            }
        }
    }

    render() {
        if (this.state.newVersionName) {
            // TODO show modal
            return null
        }

        return null
    }
}
