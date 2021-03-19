import React from 'react'
import Fa from '../misc/fa/Fa'
import styles from './popup.module.scss'

interface PopupProps {
    title?: string
    closeHandler: () => void
}

function Popup(props: React.PropsWithChildren<PopupProps>) {
    return (
        <div className={styles.container}>
            <p className={styles.title}>
                {props.title}
            </p>

            <button className={styles.closeButton} onClick={props.closeHandler}>
                    <Fa icon='fas fa-times' className={styles.times} />
            </button>

            <div>
                {props.children}
            </div>
        </div>
    )
}

export default Popup
