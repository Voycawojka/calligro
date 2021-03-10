import React, { Component } from 'react'
import { bind } from 'helpful-decorators'
import Step1CharacterList from '../step1CharacterList/Step1CharacterList'
import { WorkSlot, Slot } from '../../../generation/template/types'
import Template from '../../../generation/template/Template'
import { downloadTemplate } from '../../../generation/template/download'
import styles from './step1.module.scss'
import Fa from '../../misc//fa/Fa'
import { Link } from 'react-router-dom'
import { NumInputValue, standardizeNumericalInput } from '../../../utils/input'
import { WebOnly } from '../../envSpecific/WebOnly'
import { isElectron } from '../../../electron/electronInterop'
import { getUnicodeRanges, UnicodeRange } from '../../../utils/unicodeRanges'

const ipcRenderer = !!window.require ? window.require('electron').ipcRenderer : null


interface Step1State {
    charSet: WorkSlot[]
    defaultWidth: NumInputValue
    defaultHeight: NumInputValue
    base: NumInputValue
    selectedPreset: string
    presetInputValue: string
}

class Step1 extends Component<{}, Step1State> {
    private unicodeRanges: UnicodeRange[]
    
    constructor(props: {}) {
        super(props)

        this.unicodeRanges = getUnicodeRanges()
        this.state = this.setInitialState()
    }

    setInitialState(): Step1State {
        const storedData = window.localStorage.getItem('settings')
        const parsedData: Step1State = storedData ? JSON.parse(storedData) : null
        const initialPreset = parsedData?.selectedPreset ?? 'Basic Latin'

        return ({
            selectedPreset: initialPreset,
            charSet: parsedData?.charSet ?? this.createCharSetFromPreset(initialPreset),
            defaultWidth: parsedData?.defaultWidth ?? 150,
            defaultHeight: parsedData?.defaultHeight ?? 200,
            base: parsedData?.base ?? 150,
            presetInputValue: initialPreset
        })
    }

    componentDidUpdate(prevProps: {}, prevState: Step1State) {
        if (prevState !== this.state) {
            window.localStorage.setItem('settings', JSON.stringify(this.state))
        }
    }

    @bind
    handleCharSetInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const newCharArray = event.target.value.split('').filter(char => char !== ' ')
        const isUniqueCharSet = new Set(newCharArray).size === newCharArray.length

        event.preventDefault()

        if (isUniqueCharSet) {
            const newCharSet: WorkSlot[] = newCharArray.map(character => {
                return this.state.charSet.find(oldChar => oldChar.character === character) ?? { character }
            })

            this.setState({
                charSet: newCharSet,
                selectedPreset: 'custom',
                presetInputValue: 'custom'
            })
        }
    }

    @bind
    createCharSetFromPreset(preset: string): WorkSlot[] {
        const activeRange = this.unicodeRanges.find(range => range.category === preset)

        if (activeRange) {
            const charSet: WorkSlot[] = []

            for (let i = activeRange.range[0]; i < activeRange.range[1] + 1; i++) {
                charSet.push({character: String.fromCharCode(i)})
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

    get charString(): string {
        return this.state.charSet.map(char => char.character).join('')
    }

    @bind
    isSlotArrayValid(): boolean {
        return this.slotArray.every(slot => slot.height > 0 && slot.width > 0)
    }

    @bind
    isBaseValid(): boolean {
        const standardizedBase: number = standardizeNumericalInput(this.state.base)
        const standardizedHeight: number = standardizeNumericalInput(this.state.defaultHeight)

        return standardizedBase <= standardizedHeight && standardizedBase >= 0
    }

    @bind
    handleDefaultValueChange(event: React.ChangeEvent<HTMLInputElement>, valueName: 'defaultWidth' | 'defaultHeight' | 'base') {
        const newValue = event.target.value === '' ? '' : parseInt(event.target.value, 10)

        this.setState(prevState => ({
            ...prevState,
            [valueName]: newValue
        }))
    }
  
    @bind
    handleDimensionChange(event: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height', char: WorkSlot) {
        const newValue = event.target.value === '' ? '' : parseInt(event.target.value, 10)
        const newCharSet: WorkSlot[] = this.state.charSet.map(character => character === char
            ? {
                ...character,
                [dimension] : newValue
            }
            : character
        )

        this.setState({
            charSet: newCharSet
        })
        
    }

    @bind
    resetCharacterDimensions(char: WorkSlot) {
        const newCharSet =  this.state.charSet.map(workSlot => char === workSlot ? { character: workSlot.character } : workSlot)

        this.setState({
            charSet: newCharSet
        })
    }

    @bind
    async downloadTemplate() {
        const template = new Template(this.slotArray, standardizeNumericalInput(this.state.base))
        
        if (isElectron()) {
            const image = await template.generateImageBlob()
            const imageBlobArrayBuffer = await image.arrayBuffer()

            ipcRenderer?.send('save-template', imageBlobArrayBuffer, template.generateTemplateCode())
        } else {
            downloadTemplate(template)
        }
    }

    @bind
    changePreset(event: React.ChangeEvent<HTMLInputElement>) {
        const isValuePreset = this.unicodeRanges.some(range => range.category === event.target.value)

        this.setState({
            presetInputValue: event.target.value
        })

        if (isValuePreset) {
            const newCharset = this.createCharSetFromPreset(event.target.value)

            this.setState({
                selectedPreset: event.target.value,
                charSet: newCharset
            }, () => event.target.blur())
        }
    }

    @bind
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
            const datalistId = 'datalistId'
            
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
                        onChange={this.changePreset}
                        value={this.state.presetInputValue}
                        className={styles.presetSelect}
                        onBlur={this.presetSelectBlur}
                    />

                    <datalist id={datalistId} onClick={() => console.log('clicked')}>
                        {defaultOption}
                        {options}
                    </datalist>
                </div>
            )
        })()

        return (
            <div className={`${styles.container} ${isElectron() ? styles.desktop : ''}`}>
                <div>
                    <WebOnly div>
                        <h2 className={styles.heading}>Generate bitmap fonts in the <a href='https://www.angelcode.com/products/bmfont/doc/file_format.html' className={styles.link}>BMFont</a> format.</h2>
                        <p className={styles.paragraph}>Calligro lets you generate custom fonts from images created in graphics software like Gimp, Photoshop, Aseprite and others.</p>
                        <p className={styles.paragraph}>
                            If you’re looking to convert a truetype font into a BMFont, try tools like the
                            original <a href='https://www.angelcode.com/products/bmfont/' className={styles.link}>BMFont</a> or <a href='https://github.com/libgdx/libgdx/wiki/Hiero' className={styles.link}>Hiero</a> instead.
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
                            onChange={this.handleCharSetInput}
                            value={this.charString}
                        />
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
                                <Fa icon='fas fa-times' className={styles.times}/>
                                <input
                                    aria-label='default height input'
                                    className={styles.commonInput}
                                    type='number'
                                    onChange={event => this.handleDefaultValueChange(event, 'defaultHeight')}
                                    value={this.state.defaultHeight}
                                />
                                <Fa icon='fas fa-question' className={styles.questionMark} title='Default size of one character in pixels'/>
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

                            <button
                                onClick={this.downloadTemplate}
                                className={styles.downloadButton}
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
                                handleDimensionChange={this.handleDimensionChange}
                                resetCharacterDimensions={this.resetCharacterDimensions}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className={styles.heading}>Step 1 - Create a template</h2>
                    <ol className={styles.instructionList}>
                        <li className={styles.instructionListItem}> Specify what characters you want included in the final font. </li>
                        <li className={styles.instructionListItem}>Choose the character size and base.</li>
                        <li className={styles.instructionListItem}>Optionally override the size per character if you want some to be smaller or bigger than the rest.</li>
                        <li className={styles.instructionListItem}>Download the generated template. It’s a zip archive containing two files: png and txt. Open the png in your graphics editor of choice and draw characters inside the red boundaries.</li>
                        <li className={styles.instructionListItem}>Go to <Link to='/step2' className={styles.link}>Step 2</Link> to upload the template and generate your font.</li>
                    </ol>
                </div>
            </div>
        )
    }
}

export default Step1
