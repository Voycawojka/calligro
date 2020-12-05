import React, { Component } from 'react'
import { bind } from 'helpful-decorators'
import GenerationCharacterList from '../generationCharacterList/GenerationCharacterList'
import { WorkSlot, Slot } from '../../../generation/template/types'

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
        const newCharArray = event.target.value.split("")
        const isUniqueCharSet = new Set(newCharArray).size === newCharArray.length

        const newCharSet: WorkSlot[] = newCharArray.map(character => {
            return this.state.charSet.find(oldChar => oldChar.character === character) ?? {character: character}
        })

        event.preventDefault()

        if (isUniqueCharSet) {
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
        const newValue = parseInt(event.target.value)
        const isBaseValid = valueName === 'base' && newValue <= this.state.defaultHeight && newValue >= 0
        const isDimentionPositive = valueName !== 'base' && newValue > 0

        if (isBaseValid || isDimentionPositive) {
            this.setState(prevState => ({
                ...prevState,
                [valueName]: newValue
            }))
        }
    }
  
    @bind
    handleSpecificDimentionChange(event: React.ChangeEvent<HTMLInputElement>, dimention: 'width' | 'height', char: WorkSlot) {
        const newValue = parseInt(event.target.value)

        if (newValue > 0) {
            const newCharSet: WorkSlot[] = this.state.charSet.map(character => character === char
                ? {
                ...character,
                [dimention] : event.target.value
                }
                : character
            )

            this.setState({
                charSet: newCharSet
            })
        }
    }

    @bind
    resetCharacterDimentions(char: WorkSlot) {
        const newCharSet =  this.state.charSet.map(workSlot => char === workSlot ? { character: workSlot.character } : workSlot)

        this.setState({
            charSet: newCharSet
        })
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
                    handleSpecificDimentionChange={this.handleSpecificDimentionChange}
                    resetCharacterDimentions={this.resetCharacterDimentions}
                />

                <button>download template</button>
            </div>
        )
    }
}

export default GenerationView
