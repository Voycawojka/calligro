import 'react'
import { NavLink } from 'react-router-dom'
import styles from './navbar.module.scss'

function Navbar() {
    return (
        <nav className={styles.container}>
            <NavLink exact to='/template' className={`${styles.navLink} ${styles.navLinkLeft}`} activeClassName={styles.navLinkActive}>
                <p className={styles.linkBig}>Step 1</p>
                <p className={styles.linkSmall}>create a template</p>
            </NavLink>
            <NavLink to='/font' className={`${styles.navLink} ${styles.navLinkRight}`} activeClassName={styles.navLinkActive}>
                <p className={styles.linkBig}>Step 2</p>
                <p className={styles.linkSmall}>generate your font</p>
            </NavLink>
        </nav>
    )
}

export default Navbar
