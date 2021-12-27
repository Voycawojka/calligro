import React, { Suspense } from 'react'
import Step1 from './ui/generation/step1/Step1'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
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
import { isElectron } from './electron/electronInterop'
import LandingPage from './ui/landingPage/LandingPage'

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
                        <Header />
                    </WebOnly>

                    <Route exact path='/' render={() => (
                        isElectron() ? <Redirect to="/app/template" /> : <LandingPage />
                    )}>
                    </Route>

                    <Route exact path='/app'>
                        <Redirect to="/app/template" />
                    </Route>

                    <Route exact path='/app/template'>
                        <Suspense fallback={<Loader />}>
                            <Step1 />
                        </Suspense>
                    </Route>

                    <Route exact path='/app/font'>
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
