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
import { getUnicodeRanges, UnicodeRange } from '../../../utils/unicodeRanges'


interface Step1State {
    charSet: WorkSlot[]
    defaultWidth: NumInputValue
    defaultHeight: NumInputValue
    base: NumInputValue
    selectedPreset: string
    presetInputValue: string
    suggestionsVisible: boolean
}

class Step1 extends Component<{}, Step1State> {
    private unicodeRanges: UnicodeRange[]
    private presetInputRef: React.RefObject<HTMLInputElement>
    private firstSuggestionButtonRef: React.RefObject<HTMLButtonElement>
    private suggestionListRef: React.RefObject<HTMLUListElement>

    constructor(props: {}) {
        super(props)

        this.unicodeRanges = getUnicodeRanges()
        this.state = this.setInitialState()
        this.presetInputRef = React.createRef<HTMLInputElement>()
        this.firstSuggestionButtonRef = React.createRef<HTMLButtonElement>()
        this.suggestionListRef = React.createRef<HTMLUListElement>()
    }

    setInitialState(): Step1State {
        const storedData = window.localStorage.getItem('settings')
        const parsedData: Step1State = storedData ? JSON.parse(storedData) : null
        const initialPreset = parsedData?.selectedPreset ?? 'Basic Latin'

        return ({
            selectedPreset: initialPreset,
            presetInputValue: initialPreset,
            charSet: parsedData?.charSet ?? this.createCharSetFromPreset(initialPreset),
            defaultWidth: parsedData?.defaultWidth ?? 200,
            defaultHeight: parsedData?.defaultHeight ?? 200,
            base: parsedData?.base ?? 100,
            suggestionsVisible: false
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
                selectedPreset: 'custom'
            })

            if (this.presetInputRef && this.presetInputRef.current) {
                this.presetInputRef.current.value = 'custom'
            }
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
    downloadTemplate() {
        const template = new Template(this.slotArray, standardizeNumericalInput(this.state.base))

        downloadTemplate(template)
    }

    @bind
    changePreset(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) {
        const isValuePreset = this.unicodeRanges.some(range => range.category === value)

        if (isValuePreset) {
            const newCharset = this.createCharSetFromPreset(value)

            this.setState({
                selectedPreset: value,
                charSet: newCharset
            })


            if (this.presetInputRef && this.presetInputRef.current) {
                this.presetInputRef.current.value = value
            }

            event.currentTarget.blur()
        }
    }

    @bind
    presetSelectBlur(event: React.FocusEvent<HTMLInputElement>) {
        event.target.value = this.state.selectedPreset
    }

    @bind
    handlePresetInput(value: string) {
        this.setState({
            presetInputValue: value
        })
    }

    @bind
    handleArrowInputNavigation(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'ArrowDown') {
            if (this.firstSuggestionButtonRef.current) {
                this.firstSuggestionButtonRef.current.focus()
            }
        }
    }

    @bind
    handleArrowSuggestionsNavigation(event: React.KeyboardEvent<HTMLButtonElement>, index: number, arrayLength: number) {
        const moveFocusInsideSuggestions = (nextIndex: number) => {
            if (this.suggestionListRef.current) {
                const nextButton = this.suggestionListRef.current.children[nextIndex].children[0] as HTMLInputElement

                nextButton.focus()
            }
        }
        const moveFocusToInput = () => {
            if (this.presetInputRef.current) {
                this.presetInputRef.current.focus()
            }
        }

        if (event.key === 'ArrowDown' && index + 1 < arrayLength) {
            moveFocusInsideSuggestions(index + 1)
        }
        
        if (event.key === 'ArrowUp') {
            if (index === 0) {
                moveFocusToInput()
            } else {
                moveFocusInsideSuggestions(index - 1)
            }
        }
    }

    render() {
        const renderPresetSelect = (() => {
            const options = this.unicodeRanges
                .filter(range => range.category.toLowerCase().includes(this.state.presetInputValue.toLowerCase()))
                .slice(0, 5)
                .map((range, index, array) =>
                    <li key={range.category} >
                        <button
                            onClick={(event) => this.changePreset(event, range.category)}
                            className={styles.suggestion}
                            onKeyDown={(event) => this.handleArrowSuggestionsNavigation(event, index, array.length)}
                            ref={index === 0 ? this.firstSuggestionButtonRef : undefined}
                        >
                            {range.category}
                        </button>
                    </li>
                )

            
            return (
                <div className={styles.presetSelectContainer}>
                    <input
                        aria-label='unicode presets selection input'
                        onChange={(event) => this.handlePresetInput(event.target.value)}
                        defaultValue={this.state.selectedPreset}
                        className={styles.presetSelect}
                        onBlur={this.presetSelectBlur}
                        ref={this.presetInputRef}
                        onKeyDown={this.handleArrowInputNavigation}
                    />

                    <ul aria-label='unicode preset selection suggestions' className={styles.suggestions} ref={this.suggestionListRef}>
                        {options}
                    </ul>
                </div>
            )
        })()

        return (
            <div className={styles.container}>
                <div>
                    <div>
                        <h2 className={styles.heading}>Generate bitmap fonts in the <a href='https://www.angelcode.com/products/bmfont/doc/file_format.html' className={styles.link}>BMFont</a> format.</h2>
                        <p className={styles.paragraph}>Calligro lets you generate custom fonts from images created in graphics software like Gimp, Photoshop, Aseprite and others.</p>
                        <p className={styles.paragraph}>
                            If you’re looking to convert a truetype font into a BMFont, try tools like the
                            original <a href='https://www.angelcode.com/products/bmfont/' className={styles.link}>BMFont</a> or <a href='https://github.com/libgdx/libgdx/wiki/Hiero' className={styles.link}>Hiero</a> instead.
                        </p>
                    </div>

                    <div>
                        <div className={styles.charactersLabelContainer}>
                            <label className={styles.label}>
                                Characters
                                <Fa
                                    icon='fas fa-question'
                                    className={styles.questionMark}
                                    title='Characters you want to be included in the final font (all unicode characters should work)'
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
                                download template
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
