import React, { Component } from 'react'
import styles from './aboutPopup.module.scss'

import { bind } from 'helpful-decorators'
import Popup from '../popup/Popup'

interface AboutPopupState {
    active: boolean
}

class CookieNotice extends Component<{}, AboutPopupState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            active: false
        }
    }

    componentDidMount() {

    }

    @bind
    toggleActive() {
        this.setState({

        })
    }

    render () {
        if (this.state.active) {
            return (
                <Popup title='About' >
                    <div></div>
                </Popup>
            )
        } else {
            return null
        }
    }
}

export default CookieNotice
