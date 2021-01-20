import React, { Component } from 'react'
import Fa from '../fa/Fa'
import styles from './loader.module.scss'

interface LoaderState {
    isLoaderOn: boolean
}

class Loader extends Component<{}, LoaderState> {
    private timer?: NodeJS.Timeout

    constructor(props: {}) {
        super(props)
        this.state = {
            isLoaderOn: false
        }
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            this.setState({
                isLoaderOn: true
            })
        }, 300)
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }

    render() {
        if (!this.state.isLoaderOn) {
            return null
        } else {
            return (
                <div className={styles.container}>
                    <Fa icon='fas fa-cog fa-spin' className={styles.icon} />
                </div>
            )
        }
    }
}

export default Loader
