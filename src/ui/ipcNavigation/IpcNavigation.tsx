import React, { Component } from 'react'
import { Navigate } from 'react-router'

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
        ipcRenderer?.on('navigation', (_event: any, arg: string) => this.navigationListener(arg))
    }

    componentWillUnmount() {
        ipcRenderer?.removeListener('navigation', (_event: any, arg: string) => this.navigationListener(arg))
    }

    navigationListener(arg: string) {
        this.setState({ url: arg })
    }

    render() {
        return <Navigate replace to={this.state.url} />;
    }
}
