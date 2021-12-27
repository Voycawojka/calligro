import React from 'react'
import { Link } from 'react-router-dom'
import Head from '../Head/Head'
import styles from './policy.module.scss'

function Policy() {
    return (
        <div className={styles.policyContainer}>
            <Head title={'Privacy Policy | Calligro'}/>
            <h1>Calligro Privacy Policy</h1>
            <p>
                Calligro is an open source tool served on a static web server (Github Pages).
                We don't ask for nor collect any personal data.
                All information provided (and all files uploaded) by the user stay inside the user's browser.
            </p>
            
            <h2>Cookies and local storage</h2>
            <p>
                We use cookies and local storage (small files and pieces of data stored on the user's device) for two pursposes:
            </p>
                <ul>
                    <li>user's convenience (e.g. to rememeber last chosen settings),</li>
                    <li>analytics (more in the Analytics section below)</li>
                </ul>
            <p>
                Browsers allow users to view, remove or even entirely block cookies.
                Check your browser's manual to access those options.
            </p>
            
            <h2>Analytics</h2>
            <p>
                We use Google Analytics for analytics purposes.
                Therefore, all analytics data is stored on Google's servers.
            </p>
            <p>
                By default, we don't allow Google Analytics to use analytics or ad related tracking cookies.
                If you consent by clicking Accept on our cookie popup, we use analytics related cookies for better insight.
                We don't use ad related cookies regardless of consent.
            </p>
            
            <h2>About this policy</h2>
            <p>
                Please note we can change this privacy policy without notice.
            </p>


            <Link to='/' className={styles.menuLink}>Back to Calligro</Link>
        </div>
    )
}

export default Policy
