import { bind } from 'helpful-decorators'
import React, { Component } from 'react'

interface FontCreationViewState {
    generationAllowed: boolean
    horizontalMargin: number
    verticalMargin: number
    space: number
}

class FontCreationView extends Component<{}, FontCreationViewState> {
    private templateCodeInput: React.RefObject<HTMLInputElement>
    private templateInput: React.RefObject<HTMLInputElement>

    constructor(props: {}) {
        super(props)

        this.state = {
            generationAllowed: false,
            horizontalMargin: 0,
            verticalMargin: 0,
            space: 0
        }

        this.templateCodeInput = React.createRef()
        this.templateInput = React.createRef()
    }


    @bind
    isInputsValid() {
        const isInputsPresent = !!this.templateCodeInput.current?.files?.[0] && !!this.templateInput.current?.files?.[0]
        let generationAllowed: boolean = false

        if (isInputsPresent) {
            const isCodeInputValid = this.templateCodeInput.current?.files?.[0].type === 'text/plain'
            const isTemplateInputValid = this.templateInput.current?.files?.[0].type === 'image/png'
    
            generationAllowed = isTemplateInputValid && isCodeInputValid
        }

        this.setState({
            generationAllowed: generationAllowed
        })
    }
    
    @bind
    handleNumericalInput(event: React.ChangeEvent<HTMLInputElement>, name: 'horizontalMargin' | 'verticalMargin' | 'space') {
        const value = parseInt(event.target.value)

        if (value >= 0) {
            this.setState(prevState => ({
                ...prevState,
                [name]: value
            }))
        }
    }

    render() {
        
        return(
            <div>
                <label>code</label>
                <input type='file' ref={this.templateCodeInput} onChange={this.isInputsValid} accept='.txt'/>

                <label>template</label>
                <input type='file' ref={this.templateInput} onChange={this.isInputsValid} accept='.png' />

                <label>horizontal margin</label>
                <input 
                    type='number' 
                    onChange={(event) => this.handleNumericalInput(event, 'horizontalMargin')}
                    value={this.state.horizontalMargin}
                />

                <label>vertical margin</label>
                <input 
                    type='number' 
                    onChange={(event) => this.handleNumericalInput(event, 'verticalMargin')}
                    value={this.state.verticalMargin}
                />

                <label>space between characters</label>
                <input 
                    type='number'
                    onChange={(event) => this.handleNumericalInput(event, 'space')}
                    value={this.state.space}
                />

                <button disabled={!this.state.generationAllowed}>generate font</button>
            </div>
        )
    }
}

export default FontCreationView
