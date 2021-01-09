import React from 'react'
import { Link } from 'react-router-dom'
import Author from '../author/Author'
import styles from './footer.module.scss'

function Footer() {
    return (
        <footer className={styles.container}>
            <Link to='/policy' className={`${styles.policy} ${styles.link}`}>Cookie policy</Link>
            <div className={styles.authors}>
                <Author
                    name='Filip A. Kowalski'
                    socialLinks={[
                        {
                            url: 'http://ideasalmanac.com',
                            icon: 'fa fa-globe-africa'
                        },
                        {
                            url: 'https://twitter.com/IdeasAlmanac',
                            icon: 'fab fa-twitter'
                        },
                        {
                            url: 'https://github.com/Voycawojka',
                            icon: 'fab fa-github'
                        }
                    ]}
                />
                <Author
                    name='Dominik Józefiak'
                    socialLinks={[
                        {
                            url: 'https://github.com/domlj',
                            icon: 'fab fa-github'
                        }
                    ]}
                />
            </div>
            
            <div className={styles.linkContainer}>
                <a href='https://github.com/Voycawojka/calligro/issues' className={styles.link}>Found a bug?</a>
                <a href='https://github.com/Voycawojka/calligro/issues' className={styles.link}>Have a feature request?</a>
            </div>
        </footer>
    )
}

export default Footer
