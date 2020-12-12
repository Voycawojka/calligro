import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <nav>
            <NavLink to='/'>Step 1</NavLink>
            <NavLink to='/step2'>Step 2</NavLink>
        </nav>
    )
}

export default Navbar
