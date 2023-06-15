import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './navbar.module.scss'

function Navbar() {
    return (
        <nav className={styles.container}>
            <NavLink to='/app/template' className={({ isActive }) => `${styles.navLink} ${styles.navLinkLeft} ${isActive && styles.navLinkActive}`}>
                <p className={styles.linkBig}>Step 1</p>
                <p className={styles.linkSmall}>create a template</p>
            </NavLink>
            <NavLink to='/app/font' className={({ isActive }) => `${styles.navLink} ${styles.navLinkRight} ${isActive && styles.navLinkActive}`}>
                <p className={styles.linkBig}>Step 2</p>
                <p className={styles.linkSmall}>generate your font</p>
            </NavLink>
        </nav>
    )
}

export default Navbar
