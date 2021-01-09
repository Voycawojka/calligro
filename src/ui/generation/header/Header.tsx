import React from 'react'
import Navbar from '../navbar/Navbar'
import styles from './header.module.scss'
import GithubCorner from 'react-github-corner'

function Header() {
    return (
        <div className={styles.container}>
            <Navbar />
            <GithubCorner href='https://github.com/Voycawojka/calligro' size='90' />
        </div>
    )
}

export default Header
