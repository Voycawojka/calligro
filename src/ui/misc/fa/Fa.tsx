import 'react'

interface FaProps {
    className?: string
    icon: string
    title? : string
}

function Fa(props: FaProps) {
    const className: string = props.className ?? ''

    return (
        <i className={`${props.icon} ${className}`} title={props.title}></i>
    )
}

export default Fa
