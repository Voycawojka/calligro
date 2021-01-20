import { bind } from 'helpful-decorators'
import React, { Component } from 'react'
import { generateFont } from '../../../generation/font/Font'
import { fontSpecToTxt } from '../../../generation/font/txtSaver'
import { downloadBmf } from '../../../generation/font/download'
import styles from './step2.module.scss'
import Dropzone from '../dropzone/Dropzone'
import Fa from '../../misc/fa/Fa'

interface Step2State {
    horizontalMargin: number
    verticalMargin: number
    lineHeight: number
    template?: File
    templateCode?: File
}

class Step2 extends Component<{}, Step2State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            horizontalMargin: 0,
            verticalMargin: 0,
            lineHeight: 0
        }
    }

    @bind
    handleDropzoneInput(stateTarget: 'template' | 'templateCode', data: Blob) {
        this.setState(prevState => ({
            ...prevState,
            [stateTarget] : data
        }))
    }

    @bind
    isInputsValid(): boolean {
        const isCodeInputValid = !!this.state.templateCode && this.state.templateCode.type === 'text/plain'
        const isTemplateInputValid = !!this.state.template && this.state.template.type === 'image/png'
    
        return isTemplateInputValid && isCodeInputValid
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
        if (!this.state.template || !this.state.templateCode) {
            return
        }

        const templateImg = this.state.template
        const templateCode = await this.state.templateCode.text()

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
            <div className={styles.container}>
                <div>
                    <div className={styles.dropzones}>
                        <Dropzone
                            inputName='image'
                            acceptedInputType='.png'
                            dataType='image/png'
                            stateTarget='template'
                            handleDropzoneInput={this.handleDropzoneInput}
                            templateName={this.state.template?.name}
                        />

                        <Dropzone
                            inputName='code file'
                            acceptedInputType='.txt'
                            dataType='text/plain'
                            stateTarget='templateCode'
                            handleDropzoneInput={this.handleDropzoneInput}
                            templateName={this.state.templateCode?.name}
                        />
                    </div>

                    <div className={styles.options}>
                        <label className={styles.label}>Font options</label>
                        <div className={styles.option}>
                            <label className={styles.optionsLabel}>Margin</label>
                            <input
                                aria-label='horizontal margin input'
                                className={styles.optionsInput}
                                type='number'
                                onChange={(event) => this.handleNumericalInput(event, 'horizontalMargin')}
                                value={this.state.horizontalMargin}
                            />
                            <Fa icon='fas fa-times' className={styles.times} />
                            <input
                                aria-label='vertical margin input'
                                className={styles.optionsInput}
                                type='number'
                                onChange={(event) => this.handleNumericalInput(event, 'verticalMargin')}
                                value={this.state.verticalMargin}
                            />
                            <Fa icon='fas fa-question' className={styles.questionMark} title='Horizontal and vertical distance between characters in pixels'/>
                        </div>
                        
                        <div className={styles.option}>
                            <label className={styles.optionsLabel}>Line height</label>
                            <input
                                aria-label='line height input'
                                className={styles.optionsInput}
                                type='number'
                                onChange={(event) => this.handleNumericalInput(event, 'lineHeight')}
                                value={this.state.lineHeight}
                            />
                            <Fa icon='fas fa-question' className={styles.questionMark} title='Distance from the bottom of a line to the top of the next one in pixels'/>
                        </div>

                        <button onClick={this.downloadFont} className={styles.downloadButton} disabled={!this.isInputsValid()} >generate font</button>
                    </div>
                </div>

                <div>
                    <div>
                        <h2 className={styles.heading}>Step 2 - Generate your font</h2>
                        
                        <ol className={styles.instructionList}>
                            <li className={styles.instructionListItem}>Upload the template image with your characters drawn on it. Nothing is sent to a server, everything stays in your browser.</li>
                            <li className={styles.instructionListItem}>Upload the txt file downloaded togheter with the template image earlier (it contains template metadata).</li>
                            <li className={styles.instructionListItem}>Specify the horizontal and vertical margins for characters.</li>
                            <li className={styles.instructionListItem}>Specify the font line height (distance from the top of one line to the top of the next one).</li>
                            <li className={styles.instructionListItem}>Generate and download your BMFont.</li>
                        </ol>
                    </div>

                    <div >
                        <h2 className={styles.heading}>Coming soon</h2>

                        <ul className={styles.featureList}>
                            <li className={styles.feature}>Kerning pairs support (that is: non-monospace fonts)</li>
                            <li className={styles.feature}>XML export (some engines require it)</li>
                            <li className={styles.feature}>Font preview</li>
                        </ul>

                        <p className={styles.goodbye}>Stay tuned ;)</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Step2
