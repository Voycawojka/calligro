import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { bind } from 'helpful-decorators'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null

interface IpcNavigationState {
    url: string
}

interface IpcNavigationProps {
}

export class IpcNavigation extends Component<IpcNavigationProps, IpcNavigationState> {

    constructor(props: IpcNavigationProps) {
        super(props)

        this.state = {
            url: '/'
        }
    }

    componentDidMount() {
        ipcRenderer?.on('navigation', this.navigationListener)
    }

    componentWillUnmount() {
        ipcRenderer?.removeListener('navigation', this.navigationListener)
    }

    @bind
    navigationListener(_event: any, arg: string) {
        this.setState({ url: arg })
    }

    render() {
        return <Redirect to={this.state.url} />;
    }
}
