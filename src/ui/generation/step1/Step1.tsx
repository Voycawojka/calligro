import React, { Component } from 'react'
import Step1CharacterList from '../step1CharacterList/Step1CharacterList'
import { WorkSlot, Slot } from '../../../generation/template/types'
import Template, { FontOptions } from '../../../generation/template/Template'
import { downloadTemplate } from '../../../generation/template/download'
import styles from './step1.module.scss'
import Fa from '../../misc//fa/Fa'
import { Link } from 'react-router-dom'
import { NumInputValue, standardizeNumericalInput } from '../../../utils/input'
import { WebOnly } from '../../envSpecific/WebOnly'
import { isElectron } from '../../../electron/electronInterop'
import { getUnicodeRanges, UnicodeRange } from '../../../utils/unicodeRanges'
import { parseTemplateCode } from '../../../generation/template/parse'
import { unicodeToChar } from '../../../utils/char'
import { DesktopOnly } from '../../envSpecific/DesktopOnly'
import ExternalLink from '../../misc/externalLink/ExternalLink'
import Head from '../../Head/Head'
import { findSystemFonts } from '../../../generation/template/fontsDetection'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null


interface Step1State {
    charSet: WorkSlot[]
    defaultWidth: NumInputValue
    defaultHeight: NumInputValue
    base: NumInputValue
    selectedPreset: string
    presetInputValue: string
    charString: string
    fontOptions: FontOptions | null
    loadedSystemFonts: boolean
}

class Step1 extends Component<{}, Step1State> {
    private unicodeRanges: UnicodeRange[]
    private systemFonts: string[]

    constructor(props: {}) {
        super(props)

        this.unicodeRanges = getUnicodeRanges()
        this.systemFonts = []
        this.state = this.setInitialState()

        findSystemFonts().then(fonts => {
            this.systemFonts = fonts
            this.setState({
                loadedSystemFonts: true
            })
        })
    }

    setInitialState(): Step1State {
        const storedData = window.localStorage.getItem('settings')
        const parsedData: Step1State = storedData ? JSON.parse(storedData) : null
        const initialPreset = parsedData?.selectedPreset ?? 'Basic Latin'
        const initialCharSet = parsedData?.charSet ?? this.createCharSetFromPreset(initialPreset)
        const initialCharString = parsedData?.charString ?? initialCharSet.map(slot => slot.character).join('')
        const initialFontOptions = parsedData?.fontOptions ?? null

        return ({
            selectedPreset: initialPreset,
            charSet: initialCharSet,
            defaultWidth: parsedData?.defaultWidth ?? 150,
            defaultHeight: parsedData?.defaultHeight ?? 200,
            base: parsedData?.base ?? 150,
            presetInputValue: initialPreset,
            charString: initialCharString,
            fontOptions: initialFontOptions,
            loadedSystemFonts: false
        })
    }

    componentDidUpdate(_prevProps: {}, prevState: Step1State) {
        if (prevState !== this.state) {
            window.localStorage.setItem('settings', JSON.stringify(this.state))
        }
    }

    componentDidMount() {
        ipcRenderer?.on('load-template', (_event: any, templateCode: string) => this.loadTemplateListener(templateCode))
    }

    componentWillUnmount() {
        ipcRenderer?.removeListener('load-template', (_event: any, templateCode: string) => this.loadTemplateListener(templateCode))
    }

    loadTemplateListener(templateCode: string) {
        const code = parseTemplateCode(templateCode)

        if (code) {
            this.setState({
                base: code.base,
                charSet: code.slots.map(([character, width, height]) => ({
                    character: unicodeToChar(character),
                    width,
                    height
                })),
                selectedPreset: code.presetName,
                presetInputValue: code.presetName
            })
        }
    }

    handleCharSetInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
        event.preventDefault()

        const newCharString = event.target.value
        const newCharArray = newCharString.split('').filter(char => char.trim() !== '')
        const uniqueCharArray = [...new Set(newCharArray)]

        const newCharSet: WorkSlot[] = uniqueCharArray
            .map(character => this.state.charSet
                .find(existingSlot => existingSlot.character === character)
                ?? { character })

        this.setState({
            charString: newCharString,
            charSet: newCharSet,
            selectedPreset: 'custom',
            presetInputValue: 'custom'
        })
    }

    removeDuplicatesFromCharString() {
        const validCharString = [...new Set(this.state.charString.split(''))].join('')

        this.setState({
            charString: validCharString
        })
    }

    isCharStringValid() {
        const charArray = this.state.charString.split('')

        return new Set(charArray).size === charArray.length
    }

    createCharSetFromPreset(preset: string): WorkSlot[] {
        const activeRange = this.unicodeRanges.find(range => range.category === preset)

        if (activeRange) {
            const charSet: WorkSlot[] = []

            for (let i = activeRange.range[0]; i < activeRange.range[1] + 1; i++) {
                charSet.push({ character: String.fromCharCode(i) })
            }

            return charSet
        } else {
            return []
        }
    }

    get slotArray(): Slot[] {
        return this.state.charSet.map(workSlot => ({
            character: workSlot.character,
            width: standardizeNumericalInput(workSlot.width ?? this.state.defaultWidth),
            height: standardizeNumericalInput(workSlot.height ?? this.state.defaultHeight)
        }))
    }

    isSlotArrayValid(): boolean {
        return this.slotArray.every(slot => slot.height > 0 && slot.width > 0)
    }

    isBaseValid(): boolean {
        const standardizedBase: number = standardizeNumericalInput(this.state.base)
        const standardizedHeight: number = standardizeNumericalInput(this.state.defaultHeight)

        return standardizedBase <= standardizedHeight && standardizedBase >= 0
    }

    handleDefaultValueChange(event: React.ChangeEvent<HTMLInputElement>, valueName: 'defaultWidth' | 'defaultHeight' | 'base') {
        const newValue = event.target.value === '' ? '' : parseInt(event.target.value, 10)

        this.setState(prevState => ({
            ...prevState,
            [valueName]: newValue
        }))
    }

    handleDimensionChange(event: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height', char: WorkSlot) {
        const newValue = event.target.value === '' ? '' : parseInt(event.target.value, 10)
        const newCharSet: WorkSlot[] = this.state.charSet.map(character => character === char
            ? {
                ...character,
                [dimension]: newValue
            }
            : character
        )

        this.setState({
            charSet: newCharSet
        })

    }

    resetCharacterDimensions(char: WorkSlot) {
        const newCharSet = this.state.charSet.map(workSlot => char === workSlot ? { character: workSlot.character } : workSlot)

        this.setState({
            charSet: newCharSet
        })
    }

    async downloadTemplate() {
        const template = new Template(this.slotArray, standardizeNumericalInput(this.state.base), this.state.selectedPreset, this.state.fontOptions)

        if (isElectron()) {
            const image = await template.generateImageBlob()
            const imageBlobArrayBuffer = await image.arrayBuffer()

            ipcRenderer?.send('save-template', imageBlobArrayBuffer, template.generateTemplateCode(), template.readmeContent)
        } else {
            downloadTemplate(template)
        }
    }

    changePreset(event: React.ChangeEvent<HTMLInputElement>) {
        const isValuePreset = this.unicodeRanges.some(range => range.category === event.target.value)

        this.setState({
            presetInputValue: event.target.value
        })

        if (isValuePreset) {
            const newCharset = this.createCharSetFromPreset(event.target.value)
            const newCharString = newCharset.map(slot => slot.character).join('')

            this.setState({
                selectedPreset: event.target.value,
                charSet: newCharset,
                charString: newCharString
            }, () => event.target.blur())
        }
    }

    changePrefill(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.value === "") {
            this.setState({
                fontOptions: null
            })
        } else {
            this.setState({
                fontOptions: {
                    name: event.target.value,
                    fillColor: 'black',
                    outlineColor: ''
                }
            })
        }
    }

    presetSelectBlur(event: React.FocusEvent<HTMLInputElement>) {
        event.target.value = this.state.selectedPreset
    }

    render() {
        const renderPresetSelect = (() => {
            const options = this.unicodeRanges
                .filter(range => range.category.toLowerCase().includes(this.state.presetInputValue.toLowerCase()))
                .slice(0, 10)
                .map(range => <option value={range.category} key={range.category} >{range.category}</option>)

            const defaultOption = <option value='Basic Latin'>Default</option>
            const datalistId = 'presets-datalist'

            return (
                <div className={styles.inputContainer}>
                    <Fa
                        icon='fas fa-question'
                        className={`${styles.questionMark} ${styles.inputQuestionMark}`}
                        title='Search any unicode preset like Arabic, Cyrillic, or Hiragana'
                    />

                    <input
                        list={datalistId}
                        aria-label='unicode presets selection input'
                        onChange={event => this.changePreset(event)}
                        value={this.state.presetInputValue}
                        className={styles.presetSelect}
                        onBlur={event => this.presetSelectBlur(event)}
                    />

                    <datalist id={datalistId}>
                        {defaultOption}
                        {options}
                    </datalist>
                </div>
            )
        })()

        const defaultPrefillOption = <option value="" key="none">none</option>
        const prefillOptions = this.state.loadedSystemFonts
            ? this.systemFonts.map(font => <option value={font} key={font}>{font}</option>)
            : []

        return (
            <div className={`${styles.container} ${isElectron() ? styles.desktop : ''}`}>
                <Head title={'Template Generation | Calligro'} />
                <div>
                    <WebOnly div>
                        <h2 className={styles.heading}>Generate bitmap fonts in the <ExternalLink href='https://www.angelcode.com/products/bmfont/doc/file_format.html' className={styles.link}>BMFont</ExternalLink> format.</h2>
                        <p className={styles.paragraph}>Calligro lets you generate custom fonts from images created in graphics software like Gimp, Photoshop, Aseprite and others.</p>
                        <p className={styles.paragraph}>
                            This tool can also be used to convert a trutype font into a BMFont (with the prefill option) but if you’re looking specifically for that try tools like the original{' '}
                            <ExternalLink href='https://www.angelcode.com/products/bmfont/' className={styles.link}>BMFont</ExternalLink>
                            {' '}or{' '}
                            <ExternalLink href='https://libgdx.com/wiki/tools/hiero' className={styles.link}>Hiero</ExternalLink>
                            {' '}instead.
                        </p>
                    </WebOnly>

                    <div>
                        <div className={styles.charactersLabelContainer}>
                            <label className={`${styles.label} ${styles.charactersLabel}`}>
                                Characters
                                <Fa
                                    icon='fas fa-question'
                                    className={styles.questionMark}
                                    title={'Characters you want to be included in the final font (symbols made from multiple unicode characters won\'t work, e.g. more complex emojis)'}
                                />
                            </label>
                            {renderPresetSelect}
                        </div>
                        <textarea
                            aria-label='characters input'
                            className={styles.charactersTextArea}
                            onChange={event => this.setState({ charString: event.target.value })}
                            onBlur={event => this.handleCharSetInput(event)}
                            value={this.state.charString}
                        />
                        <button
                            onClick={() => this.removeDuplicatesFromCharString()}
                            className={styles.smallFormButton}
                            disabled={this.isCharStringValid()}
                        >
                            Remove duplicates
                        </button>
                    </div>

                    <div className={styles.parameters}>
                        <div className={styles.commonParameters}>
                            <div>
                                <label className={styles.label}>Common</label>
                                <label className={styles.commonLabel}>Size</label>
                                <input
                                    aria-label='default width input'
                                    className={styles.commonInput}
                                    type='number'
                                    onChange={event => this.handleDefaultValueChange(event, 'defaultWidth')}
                                    value={this.state.defaultWidth}
                                />
                                <Fa icon='fas fa-times' className={styles.times} />
                                <input
                                    aria-label='default height input'
                                    className={styles.commonInput}
                                    type='number'
                                    onChange={event => this.handleDefaultValueChange(event, 'defaultHeight')}
                                    value={this.state.defaultHeight}
                                />
                                <Fa icon='fas fa-question' className={styles.questionMark} title='Default size of one character in pixels' />
                            </div>

                            <div>
                                <label className={styles.commonLabel}>Base</label>
                                <input
                                    aria-label='characters base input'
                                    className={`${styles.commonInput} ${this.isBaseValid() ? '' : styles.commonInputIvalid}`}
                                    type='number'
                                    onChange={event => this.handleDefaultValueChange(event, 'base')}
                                    value={this.state.base}
                                />
                                <Fa
                                    icon='fas fa-question'
                                    className={styles.questionMark}
                                    title='Distance from the top of the letter to the line base in pixels (character parts below this will stick out like in "g" or "j")'
                                />
                            </div>

                            <div>
                                <label className={styles.commonLabel}>Prefill</label>
                                <input
                                    list="prefill-datalist"
                                    aria-label='unicode presets selection input'
                                    onChange={event => this.changePrefill(event)}
                                    value={this.state.fontOptions?.name}
                                    className={styles.prefillSelect}
                                />

                                <datalist id="prefill-datalist">
                                    {defaultPrefillOption}
                                    {prefillOptions}
                                </datalist>
                                <Fa
                                    icon='fas fa-question'
                                    className={styles.questionMark}
                                    title='Vector font to prefill the template with. Leave empty to not prefill.'
                                />
                            </div>

                            <button
                                onClick={() => this.downloadTemplate()}
                                className={styles.formButton}
                                disabled={!this.isSlotArrayValid() || !this.isBaseValid()}
                            >
                                {`${isElectron() ? 'save' : 'download'} template`}
                            </button>
                        </div>

                        <div className={styles.perCharacterParameters} >
                            <label className={styles.label}>
                                Per character
                                <Fa
                                    icon='fas fa-question'
                                    className={styles.questionMark}
                                    title='Override default size per character'
                                />
                            </label>

                            <Step1CharacterList
                                charSet={this.state.charSet}
                                defaultHeight={this.state.defaultHeight}
                                defaultWidth={this.state.defaultWidth}
                                handleDimensionChange={(event, dimension, char) => this.handleDimensionChange(event, dimension, char)}
                                resetCharacterDimensions={char => this.resetCharacterDimensions(char)}
                            />
                        </div>
                    </div>
                    {/* <div>
                        <TemplatePreview
                            width={1000}
                            height={500}
                            template={new Template(this.slotArray, standardizeNumericalInput(this.state.base), this.state.selectedPreset, this.state.fontOptions)}/>
                    </div> */}
                </div>

                <div>
                    <h2 className={styles.heading}>Step 1 - Create a template</h2>
                    <ol className={styles.instructionList}>
                        <li className={styles.instructionListItem}>Specify what characters you want included in the final font. </li>
                        <li className={styles.instructionListItem}>Choose the character size and base.</li>
                        <li className={styles.instructionListItem}>Optionally choose a font to prefill the template with. Doesn't work well with low resolution templates.</li>
                        <li className={styles.instructionListItem}>Optionally override the size per character if you want some to be smaller or bigger than the rest.</li>
                        <li className={styles.instructionListItem}>Download the generated template. It’s a zip archive containing three files: .png, .calligro and a readme. Open the png in your graphics editor of choice and draw characters inside the yellow boundaries.</li>
                        <li className={styles.instructionListItem}>
                            Go to{' '}
                            <WebOnly><Link to='/step2' className={styles.link}>Step 2</Link></WebOnly>
                            <DesktopOnly>'Fonts -&gt; Generate a font'</DesktopOnly>
                            {' '}to upload the template and generate your font.
                        </li>
                    </ol>

                    <WebOnly div>
                        <h2 className={styles.heading}>We have an offline version too</h2>
                        <p className={styles.paragraph}>The desktop version is also free and has the same features but is just a little bit more convenient to use ;)</p>
                        <div className={styles.desktopWidget}>
                            {/* Copied from itch.io */}
                            <iframe title="Itch.io desktop widget" frameBorder="0" src="https://itch.io/embed/946259" width="552" height="167"><a href="https://voycawojka.itch.io/calligro">Calligro by Voycawojka</a></iframe>
                        </div>
                        <div className={styles.mobileWidget}>
                            {/* Copied from itch.io */}
                            <iframe title="Itch.io mobile widget" frameBorder="0" src="https://itch.io/embed/946259" width="208" height="167"><a href="https://voycawojka.itch.io/calligro">Calligro by Voycawojka</a></iframe>
                        </div>
                    </WebOnly>
                </div>
            </div>
        )
    }
}

export default Step1
