import React, { Suspense } from 'react'
import Step1 from './ui/generation/step1/Step1'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Header from './ui/header/Header'
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
                <Route>
                    <WebOnly>
                        <Header />
                    </WebOnly>

                    <Route exact path='/'>
                        <Redirect to="/template" />
                    </Route>

                    <Route exact path='/template'>
                        <Suspense fallback={<Loader />}>
                            <Step1 />
                        </Suspense>
                    </Route>

                    <Route exact path='/font'>
                        <Suspense fallback={<Loader />}>
                            <Step2 />
                        </Suspense>
                    </Route>

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
