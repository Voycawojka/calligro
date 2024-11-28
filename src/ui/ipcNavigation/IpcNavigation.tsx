import { Component } from 'react'
import { Redirect } from 'react-router'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null

interface IpcNavigationState {
    url: string
}

export class IpcNavigation extends Component<{}, IpcNavigationState> {

    constructor(props: {}) {
        super(props)

        this.state = {
            url: '/'
        }
    }

    componentDidMount() {
        this.navigationListener = this.navigationListener.bind(this)
        ipcRenderer?.on('navigation', this.navigationListener)

        console.log(window.require('electron'))
    }

    componentWillUnmount() {
        ipcRenderer?.removeListener('navigation', this.navigationListener)
    }

    navigationListener(_event: any, arg: string) {
        this.setState({ url: arg })
    }

    render() {
        return <Redirect to={this.state.url} />;
    }
}
