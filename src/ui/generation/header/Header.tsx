import React from 'react'
import Navbar from '../navbar/Navbar'
import styles from './header.module.scss'
import GithubCorner from 'react-github-corner'

function Header() {
    return (
        <div className={styles.container}>
            <img src='logo.svg' alt='logo' className={styles.logo} />
            <Navbar />
            <div className={styles.sourceNoticeContainer}>
                <p className={styles.sourceNoticeLine1}>We're open source!</p>
                <p className={styles.sourceNoticeLine2}>Feel free to contribute :D</p>
            </div>
            <GithubCorner className={styles.githubCorner} href='https://github.com/Voycawojka/calligro' size='110' bannerColor='#707070' octoColor='#202020' />
        </div>
    )
}

export default Header
