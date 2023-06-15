import React, { Suspense } from 'react'
import Step1 from './ui/generation/step1/Step1'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
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
    const stepTop = (
        <WebOnly>
            <Header />
        </WebOnly>
    )
    const stepBottom = (
        <>
            <WebOnly>
                <Footer />
                <CookieNotice />
            </WebOnly>

            <DesktopOnly>
                <IpcNavigation />
                <Updater />
                <AboutPopup />
            </DesktopOnly>
        </>
    )

    return (
        <HashRouter>
            <Routes>
                <Route path='/policy' element={<Policy />} />

                <Route>
                    <Route path='/' element={<Navigate replace to="/app/template" />} />
                    <Route path='/app' element={<Navigate replace to="/app/template" />} />
                    <Route path='/app/template' element={
                        <>
                            {stepTop}
                            <Suspense fallback={<Loader />}>
                                <Step1 />
                            </Suspense>
                            {stepBottom}
                        </>
                    }/>
                    <Route path='/app/font' element={
                        <>
                            {stepTop}
                            <Suspense fallback={<Loader />}>
                                <Step2 />
                            </Suspense>
                            {stepBottom}
                        </>
                    }/>
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default App
