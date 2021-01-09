import React from 'react'

interface FaProps {
    className?: string
    icon: string
}

function Fa(props: FaProps) {
    const className: string = props.className ?? ''

    return (
        <i className={`${props.icon} ${className}`}></i>
    )
}

export default Fa
