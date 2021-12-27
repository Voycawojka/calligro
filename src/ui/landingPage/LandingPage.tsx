import React from 'react'
import { isElectron } from '../../electron/electronInterop'
import Head from '../Head/Head'
import styles from './landingPage.module.scss'

function LandingPage() {

    return (
    <div className={`${styles.container} ${isElectron() ? styles.desktop : ''}`}>
        <Head title={'Calligro - Bitmap Font Generator'} />
        <p>landing page placeholder</p>
    </div>
    )
}

export default LandingPage
