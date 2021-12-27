import { isElectron } from '../../electron/electronInterop'
import { Helmet } from 'react-helmet'

interface HeadProps {
    title: string
}

function Head(props: HeadProps) {
    if (!isElectron()) {
        return (
            <Helmet>
                <title>{props.title}</title>
            </Helmet>
        )
    } else {
        return null
    }
}

export default Head
