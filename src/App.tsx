import React, { Suspense } from 'react'
import Step1 from './ui/generation/step1/Step1'
import { HashRouter, Route, Switch } from 'react-router-dom'
import Header from './ui/header/Header'
import Footer from './ui/footer/Footer'
import Policy from './ui/policy/Policy'
import CookieNotice from './ui/cookieNotice/CookieNotice'
import Loader from './ui/misc/loader/Loader'
import { WebOnly } from './ui/envSpecific/WebOnly'
import { DesktopOnly } from './ui/envSpecific/DesktopOnly'
import { IpcNavigation } from './ui/ipcNavigation/IpcNavigation'
import { Updater } from './ui/updater/Updater'
import AboutPopup from './ui/aboutPopup/AboutPopup'

const Step2 = React.lazy(() => import('./ui/generation/step2/Step2'))

function App() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/policy'>
                    <Policy />
                </Route>

                <Route>
                    <WebOnly>
                        <Header/>
                    </WebOnly>

                    <Route exact path='/'>
                        <Step1 />
                    </Route>

                    <Route exact path='/step2'>
                        <Suspense fallback={<Loader />}>
                            <Step2 />
                        </Suspense>
                    </Route>

                    <WebOnly>
                        <Footer />
                        <CookieNotice />
                    </WebOnly>

                    <DesktopOnly>
                        <IpcNavigation />
                        <Updater />
                        <AboutPopup />
                    </DesktopOnly>
                </Route>
            </Switch>
        </HashRouter>
    )
}

export default App
