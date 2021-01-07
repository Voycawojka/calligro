import React, { Component } from 'react'
import { bind } from 'helpful-decorators'
import GenerationCharacterList from '../generationCharacterList/GenerationCharacterList'
import { WorkSlot, Slot } from '../../../generation/template/types'
import Template from '../../../generation/template/Template'
import { downloadTemplate } from '../../../generation/template/download'
import styles from './generationView.module.scss'
import Fa from '../fa/Fa'
import { Link } from 'react-router-dom'

interface GenerationViewState {
    charSet: WorkSlot[]
    defaultWidth: number
    defaultHeight: number
    base: number
}

const defaultCharacters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz.?!,:'

class GenerationView extends Component<{}, GenerationViewState> {
    constructor(props: {}) {
        super(props)

        this.state = this.setInitialState()
    }

    setInitialState(): GenerationViewState {
        const storedData = window.localStorage.getItem('settings')
        const parsedData: GenerationViewState = storedData ? JSON.parse(storedData) : null

        return ({
            charSet: parsedData?.charSet ?? this.createCharArray(),
            defaultWidth: parsedData?.defaultWidth ?? 20,
            defaultHeight: parsedData?.defaultHeight ?? 20,
            base: parsedData?.base ?? 10
        })
    }

    componentDidUpdate(prevProps: {}, prevState: GenerationViewState) {
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
    handleDefaultValueChange(event: React.ChangeEvent<HTMLInputElement>, valueName: 'defaultWidth' | 'defaultHeight' | 'base') {
        const newValue = parseInt(event.target.value, 10)
        const isBaseValid = valueName === 'base' && newValue <= this.state.defaultHeight && newValue >= 0
        const isDimensionPositive = valueName !== 'base' && newValue > 0

        if (isBaseValid || isDimensionPositive) {
            this.setState(prevState => ({
                ...prevState,
                [valueName]: newValue
            }))
        }
    }
  
    @bind
    handleDimensionChange(event: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height', char: WorkSlot) {
        const newValue = parseInt(event.target.value, 10)

        if (newValue > 0) {
            const newCharSet: WorkSlot[] = this.state.charSet.map(character => character === char
                ? {
                    ...character,
                    [dimension] : parseInt(event.target.value, 10)
                }
                : character
            )

            this.setState({
                charSet: newCharSet
            })
        }
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
        const template = new Template(this.slotArray, this.state.base)

        downloadTemplate(template)
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.description}>
                    <h2 className={styles.heading}>Generate bitmap fonts in the <Link to='http://www.angelcode.com/products/bmfont/doc/file_format.html' className={styles.link}>BMFont</Link> format.</h2>
                    <p className={styles.paragraph}>Calligro lets you generate custom fonts from images created in graphics software like Gimp, Photoshop, Aseprite and others.</p>
                    <p className={styles.paragraph}>
                        If you’re looking to convert a truetype font into a BMFont, try tools like the
                        original <Link to='http://www.angelcode.com/products/bmfont/' className={styles.link}>BMFont</Link> or <Link to='https://github.com/libgdx/libgdx/wiki/Hiero' className={styles.link}>Hiero</Link> instead.
                    </p>
                </div>

                <div className={styles.characters}>
                    <label className={styles.label}>
                        Characters
                        <Fa icon='fas fa-question' className={styles.questionMark} />
                    </label>
                    <textarea
                        className={styles.charactersTextArea}
                        onChange={this.handleCharSetInput}
                        value={this.charString}
                    />
                </div>

                <div className={styles.common}>
                    <label className={styles.label}>Common</label>
                    <div>
                        <label className={styles.commonLabel}>Size</label>
                        <input
                            className={styles.commonInput}
                            type='number'
                            onChange={event => this.handleDefaultValueChange(event, 'defaultWidth')}
                            value={this.state.defaultWidth}
                        />
                        <Fa icon='fas fa-times' className={styles.times} />
                        <input
                            className={styles.commonInput}
                            type='number'
                            onChange={event => this.handleDefaultValueChange(event, 'defaultHeight')}
                            value={this.state.defaultHeight}
                        />
                        <Fa icon='fas fa-question' className={styles.questionMark} />
                    </div>
                    
                    <div>
                        <label className={styles.commonLabel}>Base</label>
                        <input
                            className={styles.commonInput}
                            type='number'
                            onChange={event => this.handleDefaultValueChange(event, 'base')}
                            value={this.state.base}
                        />
                        <Fa icon='fas fa-question' className={styles.questionMark} />
                    </div>

                    <button onClick={this.downloadTemplate} className={styles.downloadButton}>download template</button>
                </div>

                <div className={styles.perCharacter}>
                    <label className={styles.label}>Per character</label>
                    <GenerationCharacterList
                        charSet={this.state.charSet}
                        defaultHeight={this.state.defaultHeight}
                        defaultWidth={this.state.defaultWidth}
                        handleDimensionChange={this.handleDimensionChange}
                        resetCharacterDimensions={this.resetCharacterDimensions}
                    />
                </div>

                <div className={styles.instructions}>
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

export default GenerationView
