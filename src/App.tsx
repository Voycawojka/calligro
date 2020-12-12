import React from 'react'
import FontCreationView from './ui/generation/fontCreationView/FontCreationView'
import GenerationView from './ui/generation/generationView/GenerationView'
import { HashRouter, Route, Switch } from 'react-router-dom' 
import Header from './ui/generation/header/Header'
import Footer from './ui/generation/footer/Footer'
import Policy from './ui/generation/policy/Policy'

function App() {
    return (
        <HashRouter>
            <Switch>
                <Route path='/policy'>
                    <Policy />
                </Route>

                <Route>
                    <Header/>

                    <Route exact path='/'>
                        <FontCreationView />
                    </Route>

                    <Route exact path='/step2'>
                        <GenerationView />
                    </Route>

                    <Footer />
                </Route>
            </Switch>
        </HashRouter>
    )
}

export default App
