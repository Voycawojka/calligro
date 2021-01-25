import React, { Component } from 'react'
import Cookies from 'js-cookie'
import styles from './cookieNotice.module.scss'
import { Link } from 'react-router-dom'
import { bind } from 'helpful-decorators'

interface CookieNoticeState {
    acknowledged: boolean
}

class CookieNotice extends Component<{}, CookieNoticeState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            acknowledged: false
        }
    }

    componentDidMount() {
        this.setState({
            acknowledged: Cookies.get('cookies-acknowledged') === 'true'
        }, this.updateAnalytics)
    }

    @bind
    handleExit() {
        Cookies.set('cookies-acknowledged', 'true', { expires: 1000 })

        this.setState({
            acknowledged: true
        }, this.updateAnalytics)
    }

    @bind
    updateAnalytics() {
        const analyticsStatus = this.state.acknowledged ? 'granted' : 'denied'

        window.gtag('consent', 'update', {
            analytics_storage: analyticsStatus
        });
    }

    render () {
        if (!this.state.acknowledged) {
            return (
                <div className={styles.container}>
                    <h2 className={styles.heading}>We use cookies</h2>
                    <div className={styles.content}>
                        <img className={styles.image} src='cookie.svg' alt='cookie'/>
                        <div className={styles.details}>
                            <ul className={styles.list}>
                                <li className={styles.listItem}>for your convienience</li>
                                <li className={styles.listItem}>for analytics</li>
                            </ul>

                            <div className={styles.linkContainer}>
                                <Link to='/policy' className={styles.link}>Learn more</Link>
                                <button onClick={this.handleExit} className={styles.link} >Accept</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return null
        }
    }
}

export default CookieNotice
