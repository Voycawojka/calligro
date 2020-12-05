import React, { Component } from 'react'
import { bind } from 'helpful-decorators'
import GenerationCharacterList from '../generationCharacterList/GenerationCharacterList'
import { WorkSlot } from '../../../generation/template/types'

interface GenerationViewState {
  charSet: WorkSlot[]
  defaultWidth: number
  defaultHeight: number
}

class GenerationView extends Component<{}, GenerationViewState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      charSet: this.createCharArray(),
      defaultWidth: 20,
      defaultHeight: 20
    }
  }

  createCharArray(): WorkSlot[] {
    return Array.from('AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz.?!,:', (character: string) => ({character: character}))
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

  get charString(): string {
    return this.state.charSet.map(char => char.character).join("")
  }

  @bind
  handleDefaultDimentionChange(event: React.ChangeEvent<HTMLInputElement>, width: boolean) {
    const dimention = width ? 'defaultWidth' : 'defaultHeight'

    event.preventDefault()

    this.setState(prevState => ({
      ...prevState,
      [dimention]: event.target.value
    }))
  }
  
  @bind
  handleDimentionChange(event: React.ChangeEvent<HTMLInputElement>, width: boolean, char: WorkSlot) {
    const dimention = width ? 'width' : 'height'

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

  render() {
    return (
      <div className='generation-view'>
        <textarea 
          onChange={this.handleCharSetInput}
          value={this.charString}
        />

        <label>width</label>
        <input 
          type='number' 
          onChange={event => this.handleDefaultDimentionChange(event, true)} 
          value={this.state.defaultWidth}
        />
        <label>height</label>
        <input 
          type='number' 
          onChange={event => this.handleDefaultDimentionChange(event, false)} 
          value={this.state.defaultHeight}
        />

        <GenerationCharacterList 
          charSet={this.state.charSet} 
          defaultHeight={this.state.defaultHeight} 
          defaultWidth={this.state.defaultWidth} 
          handleDimentionChange={this.handleDimentionChange}
        />

        
      </div>
    )
  }

}

export default GenerationView
