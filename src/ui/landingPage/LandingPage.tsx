import { isElectron } from '../../electron/electronInterop'
import styles from './landingPage.module.scss'

function LandingPage() {

    return <div className={`${styles.container} ${isElectron() ? styles.desktop : ''}`}>landing page placeholder</div>
}

export default LandingPage
