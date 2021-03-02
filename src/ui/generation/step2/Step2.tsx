import { bind } from 'helpful-decorators'
import React, { Component } from 'react'
import { generateFont, KerningPair } from '../../../generation/font/Font';
import { fontSpecToTextFile } from '../../../generation/font/specSaver'
import { downloadBmf } from '../../../generation/font/download'
import styles from './step2.module.scss'
import Dropzone from '../dropzone/Dropzone'
import Fa from '../../misc/fa/Fa'
import { NumInputValue, standardizeNumericalInput } from '../../../utils/input'
import Step2KerningPairsList from '../step2KerningPairsList/Step2KerningPairsList'
import { parseTemplateCode } from '../../../generation/template/parse';
import { isElectron } from '../../../electron/electronInterop';

interface Step2State {
    horizontalMargin: NumInputValue
    verticalMargin: NumInputValue
    lineHeight: NumInputValue
    kerningPairs: KerningPair[]
    isKerningsValid: boolean
    template?: File
    templateCode?: File
    templateError?: string
    templateCodeError?: string
}

class Step2 extends Component<{}, Step2State> {
    constructor(props: {}) {
        super(props)

        this.state = {
            horizontalMargin: 0,
            verticalMargin: 0,
            lineHeight: 0,
            kerningPairs: [],
            isKerningsValid: true
        }
    }

    @bind
    async handleTemplateDropzoneInput(data: File) {
        if (!this.isTemplateFileValid(data)) {
            this.setState(prevState => ({
                ...prevState,
                templateError: 'Uploaded file isn\'t a valid template.',
                template: undefined
            }))
            return
        }

        this.setState(prevState => ({
            ...prevState,
            templateError: undefined,
            templateCodeError: undefined,
            template: data
        }))
    }

    @bind
    async handleCodeDropzoneInput(data: File) {
        if (!(await this.isCodeFileValid(data))) {
            this.setState(prevState => ({
                ...prevState,
                templateCodeError: 'Uploaded file isn\'t a valid code.',
                templateCode: undefined
            }))
            return
        }

        this.setState(prevState => ({
            ...prevState,
            templateError: undefined,
            templateCodeError: undefined,
            templateCode: data
        }))
    }

    async isCodeFileValid(file?: Blob): Promise<boolean> {
        return !!file && file.type === 'text/plain' && !!parseTemplateCode(await file.text())
    }

    isTemplateFileValid(file?: Blob): boolean {
        return !!file && file.type === 'image/png'
    }

    @bind
    areDropzonesValid(): boolean {
        return this.isTemplateFileValid(this.state.template)
            && this.isCodeFileValid(this.state.templateCode)
            && this.state.isKerningsValid
    }
    
    @bind
    handleNumericalInput(event: React.ChangeEvent<HTMLInputElement>, name: 'horizontalMargin' | 'verticalMargin' | 'lineHeight') {
        const value = event.target.value === '' ? '' : parseInt(event.target.value, 10)

        if (value === '' || value >= 0) {
            this.setState(prevState => ({
                ...prevState,
                [name]: value
            }))
        }
    }

    @bind
    async downloadFont(format: 'txt' | 'xml') {
        if (!this.state.template || !this.state.templateCode) {
            return
        }

        const templateImg = this.state.template
        const templateCode = await this.state.templateCode.text()

        const [fontSpec, pages] = await generateFont(templateImg, templateCode, {
            horizontalSpacing: standardizeNumericalInput(this.state.horizontalMargin) ,
            verticalSpacing: standardizeNumericalInput(this.state.verticalMargin),
            lineHeight: standardizeNumericalInput(this.state.lineHeight),
            kernings: this.state.kerningPairs
        })

        const fntFile = fontSpecToTextFile(fontSpec, format)

        downloadBmf(fntFile, pages)
    }

    @bind
    changeKernings(kernings: KerningPair[]) {
        this.setState({
            kerningPairs: kernings
        })
    }

    @bind
    handleKerningsValidity(valid: boolean) {
        this.setState({
            isKerningsValid: valid
        })
    }

    render() {
        return(
            <div className={`${styles.container} ${isElectron() ? styles.containerDesktop : ''}`}>
                <div>
                    <div className={styles.dropzones}>
                        <Dropzone
                            inputName='image'
                            acceptedInputType='.png'
                            dataType='image/png'
                            handleDropzoneInput={this.handleTemplateDropzoneInput}
                            fileName={this.state.template?.name}
                            error={this.state.templateError}
                        />

                        <Dropzone
                            inputName='code file'
                            acceptedInputType='.txt'
                            dataType='text/plain'
                            handleDropzoneInput={this.handleCodeDropzoneInput}
                            fileName={this.state.templateCode?.name}
                            error={this.state.templateCodeError}
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

                        <Step2KerningPairsList
                            templateCode={this.state.templateCode}
                            changeKernings={this.changeKernings}
                            handleKerningsValidity={this.handleKerningsValidity}
                        />

                        <div className={styles.download}>
                            <label className={styles.buttonsContainerLabel}>Download font</label>

                            <div className={styles.buttons}>
                                <div>
                                    <button onClick={() => this.downloadFont('txt')} className={styles.downloadButton} disabled={!this.areDropzonesValid()} >txt format</button>
                                    <Fa icon='fas fa-question' className={styles.questionMark} title='Supported by Godot, LibGDX, Heaps.io and possibly others.'/>
                                </div>

                                <div>
                                    <button onClick={() => this.downloadFont('xml')} className={styles.downloadButton} disabled={!this.areDropzonesValid()} >xml format</button>
                                    <Fa icon='fas fa-question' className={styles.questionMark} title='Supported by Phaser, HaxeFlixel and possibly others.'/>
                                </div>
                            </div>
                            
                            <p className={styles.samplesParagraph}>
                                Check
                                <a
                                    href='https://github.com/Voycawojka/calligro/tree/main/samples'
                                    className={styles.samplesLink}
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    our samples
                                </a>
                                to see how to use it
                            </p>
                        </div>
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
                            <li className={styles.instructionListItem}>
                                <p>
                                    Add kerning pairs if you want to. Characters in a pair are rendered further or closer to each other.
                                    E.g. pair "ab" with distance -10 will cause "b" to be 10 pixels closer to "a". Pair "ab" &ne; "ba"!
                                </p>
                                <p>
                                    Warning - not all tools support this feature. We know Godot does.
                                </p>
                            </li>
                            <li className={styles.instructionListItem}>Generate and download your BMFont.</li>
                        </ol>
                    </div>

                    <div >
                        <h2 className={styles.heading}>Coming soon</h2>

                        <ul className={styles.featureList}>
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
