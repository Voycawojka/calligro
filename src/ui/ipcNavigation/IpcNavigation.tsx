import { Component } from 'react'
import { Redirect } from 'react-router'

const ipcRenderer = window.require ? window.require('electron').ipcRenderer : null

interface IpcNavigationState {
    url: string
}

interface IpcNavigationProps {
}

interface IpcEvent {
}

export class IpcNavigation extends Component<IpcNavigationProps, IpcNavigationState> {

    constructor(props: {}) {
        super(props)

        this.state = {
            url: '/'
        }
    }

    componentDidMount() {
        this.navigationListener = this.navigationListener.bind(this)
        ipcRenderer?.on('navigation', this.navigationListener)
    }

    componentWillUnmount() {
        ipcRenderer?.removeListener('navigation', this.navigationListener)
    }

    navigationListener(_event: IpcEvent, arg: string) {
        this.setState({ url: arg })
    }

    render() {
        return <Redirect to={this.state.url} />;
    }
}
