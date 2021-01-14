import React from 'react'
import Navbar from '../navbar/Navbar'
import styles from './header.module.scss'
import GithubCorner from 'react-github-corner'

function Header() {
    return (
        <div className={styles.container}>
            <img src='logo.svg' alt='logo' className={styles.logo}/>
            <Navbar />
            <GithubCorner href='https://github.com/Voycawojka/calligro' size='110' />
        </div>
    )
}

export default Header
