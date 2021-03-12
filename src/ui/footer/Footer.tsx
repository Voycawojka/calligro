import React from 'react'
import { Link } from 'react-router-dom'
import Authors from '../authors/Authors'
import styles from './footer.module.scss'

function Footer() {
    return (
        <footer className={styles.container}>
            <Link to='/policy' className={`${styles.policy} ${styles.link}`}>Privacy policy</Link>
            <div className={styles.authors}>
                <Authors />
            </div>
            
            <div className={styles.linkContainer}>
                <a href='https://github.com/Voycawojka/calligro/issues' className={styles.link}>Found a bug?</a>
                <a href='https://github.com/Voycawojka/calligro/issues' className={styles.link}>Have a feature request?</a>
            </div>
        </footer>
    )
}

export default Footer
