import 'react'
import Navbar from '../navbar/Navbar'
import styles from './header.module.scss'
import GithubCorner from 'react-github-corner'

function Header() {
    return (
        <header className={styles.container}>
            <h1 className={styles.heading}>
                <a href="/"><img src='img/promo/logo.svg' alt='Calligro' height='80' width='158' className={styles.logo} /></a>
            </h1>
            <Navbar />
            <div className={styles.sourceNoticeContainer}>
                <p className={styles.sourceNoticeLine1}>We're open source!</p>
                <p className={styles.sourceNoticeLine2}>Feel free to contribute :D</p>
            </div>
            <GithubCorner className={styles.githubCorner} href='https://github.com/Voycawojka/calligro' size='110' bannerColor='#707070' octoColor='#202020' />
        </header>
    )
}

export default Header
