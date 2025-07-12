import Toolbar from './ui/toolbar/Toolbar'
import WorkAreaContainer from './ui/workarea/WorkAreaContainer'
import ThemeContextRoot from './ui/contexts/ThemeContext'
import ProjectContextRoot from './ui/contexts/ProjectContext'
import { BlueprintProvider } from '@blueprintjs/core'

import "normalize.css/normalize.css"
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import "@blueprintjs/select/lib/css/blueprint-select.css"

function App() {
    return (
        //  <WebOnly>
        //     <Header />
        // </WebOnly>

        <BlueprintProvider>
            <ThemeContextRoot>
                <ProjectContextRoot>
                    <Toolbar />
                    <WorkAreaContainer />
                </ProjectContextRoot>
            </ThemeContextRoot>
        </BlueprintProvider>

        // <DesktopOnly>
        //     <IpcNavigation />
        //     <Updater />
        //     <AboutPopup />
        // </DesktopOnly> */}
    )
}

export default App
