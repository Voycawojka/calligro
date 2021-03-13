import React from 'react'
import Author from '../author/Author'

function Authors() {
    return (
            <>
                <Author
                    name='Filip A. Kowalski'
                    socialLinks={[
                        {
                            url: 'http://ideasalmanac.com',
                            icon: 'fa fa-globe-africa',
                            label: 'ideasalmanac'
                        },
                        {
                            url: 'https://twitter.com/IdeasAlmanac',
                            icon: 'fab fa-twitter',
                            label: 'twitter'
                        },
                        {
                            url: 'https://github.com/Voycawojka',
                            icon: 'fab fa-github',
                            label: 'github'
                        }
                    ]}
                />
                <Author
                    name='Dominik Józefiak'
                    socialLinks={[
                        {
                            url: 'https://github.com/domlj',
                            icon: 'fab fa-github',
                            label: 'github'
                        }
                    ]}
                />
            </>
    )
}

export default Authors
