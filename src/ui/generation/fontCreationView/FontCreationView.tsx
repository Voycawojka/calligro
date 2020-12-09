import { bind } from 'helpful-decorators'
import React, { Component } from 'react'
import { generateFont } from '../../../generation/font/Font'
import { fontSpecToTxt } from '../../../generation/font/txtSaver'
import { downloadBmf } from '../../../generation/font/download'

interface FontCreationViewState {
    generationAllowed: boolean
    horizontalMargin: number
    verticalMargin: number
    lineHeight: number
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
            lineHeight: 0
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
    handleNumericalInput(event: React.ChangeEvent<HTMLInputElement>, name: 'horizontalMargin' | 'verticalMargin' | 'lineHeight') {
        const value = parseInt(event.target.value, 10)

        if (value >= 0) {
            this.setState(prevState => ({
                ...prevState,
                [name]: value
            }))
        }
    }

    @bind
    async downloadFont() {
        const templateImg = this.templateInput.current?.files?.[0]
        const templateCode = await this.templateCodeInput.current?.files?.[0].text()

        if (!templateImg || !templateCode) {
            return
        }

        const [fontSpec, pages] = await generateFont(templateImg, templateCode, {
            horizontalSpacing: this.state.horizontalMargin,
            verticalSpacing: this.state.verticalMargin,
            lineHeight: this.state.lineHeight
        })

        const fntFile = fontSpecToTxt(fontSpec)

        downloadBmf(fntFile, pages)
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

                <label>line height</label>
                <input
                    type='number'
                    onChange={(event) => this.handleNumericalInput(event, 'lineHeight')}
                    value={this.state.lineHeight}
                />

                <button 
                    disabled={!this.state.generationAllowed}
                    onClick={this.downloadFont}>
                        generate font
                </button>
            </div>
        )
    }
}

export default FontCreationView
