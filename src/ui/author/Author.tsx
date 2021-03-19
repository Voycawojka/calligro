import React from 'react'
import styles from './author.module.scss'
import Fa from '../misc/fa/Fa'
import ExternalLink from '../misc/externalLink/ExternalLink'

interface Social {
    icon: string
    url: string
    label: string
}

interface AuthorProps {
    name: string
    socialLinks: Social[]
}

function Author(props: AuthorProps) {
    const renderSocial = props.socialLinks.map(social =>
        <ExternalLink className={styles.socialLink} href={social.url} key={social.url} aria-label={social.label} >
            <Fa icon={social.icon} className={styles.icon} />
        </ExternalLink>
    )

    return (
        <div className={styles.container}>
            <h3 className={styles.name}>{props.name}</h3>
            <div className={styles.socialContainer}>
                {renderSocial}
            </div>
        </div>
    )
}

export default Author
