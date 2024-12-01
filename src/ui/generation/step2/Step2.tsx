import React, { Component } from 'react'
import { FontConfig, generateFont, KerningPair } from '../../../generation/font/Font'
import { fontSpecToTextFile } from '../../../generation/font/specSaver'
import { downloadBmf } from '../../../generation/font/download'
import styles from './step2.module.scss'
import Dropzone from '../dropzone/Dropzone'
import Fa from '../../misc/fa/Fa'
import { NumInputValue, standardizeNumericalInput } from '../../../utils/input'
import Step2KerningPairsList from '../step2KerningPairsList/Step2KerningPairsList'
import { isElectron } from '../../../electron/electronInterop'
import { parseTemplateCode } from '../../../generation/template/parse'
import FontPreview from '../fontPreview/FontPreview'
import { CodePayload } from '../../../generation/template/types'
import Head from '../../Head/Head'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null

interface Step2State {
    horizontalMargin: NumInputValue
    verticalMargin: NumInputValue
    lineHeight: NumInputValue
    kerningPairs: KerningPair[]
    isKerningsValid: boolean
    template?: File
    templateCode?: CodePayload
    templateCodeName?: string
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

    async handleCodeDropzoneInput(data: File) {
        if (!this.isCodeFileValid(data)) {
            this.setState(prevState => ({
                ...prevState,
                templateCodeError: 'Uploaded file isn\'t valid.',
                templateCode: undefined
            }))
            return
        }

        const code = parseTemplateCode(await data.text())

        if (!code) {
            this.setState(prevState => ({
                ...prevState,
                templateCodeError: 'Uploaded code isn\'t valid.',
                templateCode: undefined
            }))
            return
        }

        this.setState(prevState => ({
            ...prevState,
            templateError: undefined,
            templateCodeError: undefined,
            templateCode: code,
            templateCodeName: data.name,
            lineHeight: code.slots[0]?.[2] ?? 0
        }))
    }

    isCodeFileValid(file?: File): boolean {
        const nameParts = file?.name.split('.')
        const extension = nameParts && nameParts[nameParts.length-1]
        return extension === 'calligro'
    }

    isTemplateFileValid(file?: Blob): boolean {
        return !!file && file.type === 'image/png'
    }

    areDropzonesValid(): boolean {
        return !this.state.templateError
            && !this.state.templateCodeError
            && !!this.state.template
            && !!this.state.templateCode
            && this.state.isKerningsValid
    }
    
    handleNumericalInput(event: React.ChangeEvent<HTMLInputElement>, name: 'horizontalMargin' | 'verticalMargin' | 'lineHeight') {
        const value = event.target.value === '' ? '' : parseInt(event.target.value, 10)

        if (value === '' || value >= 0) {
            this.setState(prevState => ({
                ...prevState,
                [name]: value
            }))
        }
    }

    async downloadFont(format: 'txt' | 'xml') {
        if (!this.state.template || !this.state.templateCode) {
            return
        }

        const templateImg = this.state.template

        if (!this.state.templateCode) {
            console.warn('Cannot generate a font in the current app state.')
            return
        }

        const [fontSpec, pages] = await generateFont(templateImg, this.state.templateCode, this.getFontConfig())

        const fntFile = fontSpecToTextFile(fontSpec, format)

        if (isElectron()) {
            let pagesBufferArray: ArrayBuffer[] = []

            for (let i = 0; i < pages.length; i++) {
                const buffer = await pages[i].arrayBuffer()
                pagesBufferArray.push(buffer)
            }

            ipcRenderer?.send('save-font', fntFile, pagesBufferArray)
        } else {
            downloadBmf(fntFile, pages)
        }
    }

    getFontConfig(): FontConfig {
        return {
            horizontalSpacing: standardizeNumericalInput(this.state.horizontalMargin) ,
            verticalSpacing: standardizeNumericalInput(this.state.verticalMargin),
            lineHeight: standardizeNumericalInput(this.state.lineHeight),
            kernings: this.state.kerningPairs
        }
    }

    changeKernings(kernings: KerningPair[]) {
        this.setState({
            kerningPairs: kernings
        })
    }

    handleKerningsValidity(valid: boolean) {
        this.setState({
            isKerningsValid: valid
        })
    }

    render() {
        return(
            <div className={`${styles.container} ${isElectron() ? styles.desktop : ''}`}>
                <Head title={'Font Generation | Calligro'}/>
                <div className={styles.toolbar}>
                    <div className={`${styles.dropzones} ${isElectron() ? styles.desktop : ''}`}>
                        <Dropzone
                            inputName='image'
                            acceptedInputType='.png'
                            dataType='image/png'
                            handleDropzoneInput={data => this.handleTemplateDropzoneInput(data)}
                            fileName={this.state.template?.name}
                            error={this.state.templateError}
                        />

                        <Dropzone
                            inputName='code file'
                            acceptedInputType='.calligro'
                            handleDropzoneInput={data => this.handleCodeDropzoneInput(data)}
                            fileName={this.state.templateCodeName}
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
                            <Fa icon='fas fa-question' className={styles.questionMark} title='Distance from the top of a line to the top of the next one in pixels'/>
                        </div>

                        <Step2KerningPairsList
                            templateCode={this.state.templateCode}
                            changeKernings={kernings => this.changeKernings(kernings)}
                            handleKerningsValidity={valid => this.handleKerningsValidity(valid)}
                        />
                    </div>

                    <div className={styles.download}>
                        <label className={styles.buttonsContainerLabel}>
                            {`${isElectron() ? 'save' : 'download'} font`}
                        </label>

                        <div className={styles.buttons}>
                            <div>
                                <button onClick={() => this.downloadFont('txt')} className={styles.formButton} disabled={!this.areDropzonesValid()} >txt format</button>
                                <Fa icon='fas fa-question' className={styles.questionMark} title='Supported by Godot, LibGDX, LÖVE, Heaps.io and possibly others.'/>
                            </div>

                            <div>
                                <button onClick={() => this.downloadFont('xml')} className={styles.formButton} disabled={!this.areDropzonesValid()} >xml format</button>
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

                <div className={`${styles.previewContainer} ${isElectron() ? styles.desktop : ''}`}>
                    <FontPreview
                        width={400}
                        height={250}
                        templateCode={this.state.templateCode}
                        templateImg={this.state.template}
                        fontConfig={this.getFontConfig()} />
                </div>
            </div>
        )
    }
}

export default Step2
