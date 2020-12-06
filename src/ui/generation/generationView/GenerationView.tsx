import React, { Component } from 'react'
import { bind } from 'helpful-decorators'
import GenerationCharacterList from '../generationCharacterList/GenerationCharacterList'
import { WorkSlot, Slot } from '../../../generation/template/types'
import Template from '../../../generation/template/Template'

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

        this.state = {
            charSet: this.createCharArray(),
            defaultWidth: 20,
            defaultHeight: 20,
            base: 10
        }
  }

    createCharArray(): WorkSlot[] {
        return Array.from(defaultCharacters, (character: string) => ({character: character}))
    }

    @bind
    handleCharSetInput(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const newCharArray = event.target.value.split("").filter(char => char !== " ")
        const isUniqueCharSet = new Set(newCharArray).size === newCharArray.length

        event.preventDefault()

        if (isUniqueCharSet) {
            const newCharSet: WorkSlot[] = newCharArray.map(character => {
                return this.state.charSet.find(oldChar => oldChar.character === character) ?? {character: character}
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
            height: workSlot.width ?? this.state.defaultHeight
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
                    [dimension] : event.target.value
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

    }

    render() {
        return (
            <div>
                <textarea 
                    onChange={this.handleCharSetInput}
                    value={this.charString}
                />

                <label>width</label>
                <input 
                    type='number' 
                    onChange={event => this.handleDefaultValueChange(event, 'defaultWidth')} 
                    value={this.state.defaultWidth}
                    />
                <label>height</label>
                <input 
                    type='number' 
                    onChange={event => this.handleDefaultValueChange(event, 'defaultHeight')} 
                    value={this.state.defaultHeight}
                />
                <label>base</label>
                <input 
                    type='number' 
                    onChange={event => this.handleDefaultValueChange(event, 'base')} 
                    value={this.state.base}
                />

                <GenerationCharacterList 
                    charSet={this.state.charSet} 
                    defaultHeight={this.state.defaultHeight} 
                    defaultWidth={this.state.defaultWidth} 
                    handleDimensionChange={this.handleDimensionChange}
                    resetCharacterDimensions={this.resetCharacterDimensions}
                />

                <button>download template</button>
            </div>
        )
    }
}

export default GenerationView
