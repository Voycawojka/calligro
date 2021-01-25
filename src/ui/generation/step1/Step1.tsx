import React, { Component } from 'react'
import { bind } from 'helpful-decorators'
import Step1CharacterList from '../step1CharacterList/Step1CharacterList'
import { WorkSlot, Slot } from '../../../generation/template/types'
import Template from '../../../generation/template/Template'
import { downloadTemplate } from '../../../generation/template/download'
import styles from './step1.module.scss'
import Fa from '../../misc//fa/Fa'
import { Link } from 'react-router-dom'

interface Step1State {
    charSet: WorkSlot[]
    defaultWidth: number
    defaultHeight: number
    base: number
}

const defaultCharacters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz.?!,:'

class Step1 extends Component<{}, Step1State> {
    constructor(props: {}) {
        super(props)

        this.state = this.setInitialState()
    }

    setInitialState(): Step1State {
        const storedData = window.localStorage.getItem('settings')
        const parsedData: Step1State = storedData ? JSON.parse(storedData) : null

        return ({
            charSet: parsedData?.charSet ?? this.createCharArray(),
            defaultWidth: parsedData?.defaultWidth ?? 200,
            defaultHeight: parsedData?.defaultHeight ?? 200,
            base: parsedData?.base ?? 100
        })
    }

    componentDidUpdate(prevProps: {}, prevState: Step1State) {
        if (prevState !== this.state) {
            window.localStorage.setItem('settings', JSON.stringify(this.state))
        }
    }

    createCharArray(): WorkSlot[] {
        return Array.from(defaultCharacters, (character: string) => ({ character }))
    }

    @bind
    handleCharSetInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const newCharArray = event.target.value.split("").filter(char => char !== " ")
        const isUniqueCharSet = new Set(newCharArray).size === newCharArray.length

        event.preventDefault()

        if (isUniqueCharSet) {
            const newCharSet: WorkSlot[] = newCharArray.map(character => {
                return this.state.charSet.find(oldChar => oldChar.character === character) ?? { character }
            })

            this.setState({
                charSet: newCharSet
            })
        }
    }

    get slotArray(): Slot[] {
        return this.state.charSet.map(workSlot => ({
            character: workSlot.character,
            width: workSlot.width ?? this.state.defaultWidth,
            height: workSlot.height ?? this.state.defaultHeight
        }))
    }

    get charString(): string {
        return this.state.charSet.map(char => char.character).join("")
    }

    @bind
    isSlotArrayValid(): boolean {
        return this.slotArray.every(slot => slot.height > 0 && slot.width > 0)
    }

    @bind
    isBaseValid(): boolean {
        return this.state.base <= this.state.defaultHeight && this.state.base >= 0
    }

    @bind
    isCharsetDefault(): boolean {
        return this.charString === defaultCharacters
    }

    @bind
    handleDefaultValueChange(event: React.ChangeEvent<HTMLInputElement>, valueName: 'defaultWidth' | 'defaultHeight' | 'base') {
        const newValue = event.target.value ? parseInt(event.target.value, 10) : 0

        this.setState(prevState => ({
            ...prevState,
            [valueName]: newValue
        }))
    }
  
    @bind
    handleDimensionChange(event: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height', char: WorkSlot) {
        const newValue = event.target.value ? parseInt(event.target.value, 10) : 0
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
    resetCharacters() {
        this.setState({
            charSet: this.createCharArray()
        })
    }

    @bind
    downloadTemplate() {
        const template = new Template(this.slotArray, this.state.base)

        downloadTemplate(template)
    }

    render() {
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
                            <button
                                title='Reset characters to default values'
                                onClick={this.resetCharacters}
                                className={styles.charactersResetButton}
                                disabled={this.isCharsetDefault()}
                            >
                                <Fa icon='fas fa-undo' />
                            </button>
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
                                    className={`${styles.commonInput} ${this.isBaseValid() ? "" : styles.commonInputIvalid}`}
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
