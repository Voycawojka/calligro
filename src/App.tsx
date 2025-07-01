import Toolbar from './ui/toolbar/Toolbar'
import WorkAreaContainer from './ui/workarea/WorkAreaContainer'
import ProjectContextRoot from './ui/ProjectContext'

import "normalize.css/normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import { BlueprintProvider } from '@blueprintjs/core'

// const Step2 = React.lazy(() => import('./ui/generation/step2/Step2'))

function App() {
    return (
        // <HashRouter>
        //     <Switch>
        //         <Route>
                    //  <WebOnly>
                    //     <Header />
                    // </WebOnly>

                    <BlueprintProvider>
                        <ProjectContextRoot>
                            <Toolbar />
                            <WorkAreaContainer />
                        </ProjectContextRoot>
                    </BlueprintProvider>

                    // {/* <Route exact path='/'>
                    //     <Redirect to="/template" />
                    // </Route>

                    // <Route exact path='/template'>
                    //     <Suspense fallback={<Loader />}>
                    //         <Step1 />
                    //     </Suspense>
                    // </Route>

                    // <Route exact path='/font'>
                    //     <Suspense fallback={<Loader />}>
                    //         <Step2 />
                    //     </Suspense>
                    // </Route>

                    // <DesktopOnly>
                    //     <IpcNavigation />
                    //     <Updater />
                    //     <AboutPopup />
                    // </DesktopOnly> */}
        //         </Route>
        //     </Switch>
        // </HashRouter>
    )
}

export default App
