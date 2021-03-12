import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { bind } from 'helpful-decorators'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null
const shell = !!window.require ? window.require('electron').shell : null

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
        this.setupLinksOpeningStrategy()
    }

    componentWillUnmount() {
        ipcRenderer?.removeListener('navigation', this.navigationListener)
    }

    @bind
    navigationListener(_event: any, arg: string) {
        this.setState({ url: arg })
    }

    setupLinksOpeningStrategy() {
        document.addEventListener('click', (event: MouseEvent) => {
            if ((event.target as HTMLElement).tagName === 'A') {
                const target = event.target as HTMLLinkElement
                
                if (target.href.startsWith('http')) {
                    event.preventDefault()
                    shell?.openExternal(target.href)
                }   
            }
        })
    }

    render() {
        return <Redirect to={this.state.url} />;
    }
}
