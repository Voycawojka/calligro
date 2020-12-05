import React, { Component } from 'react'
import { WorkSlot } from '../../../generation/template/types'

interface GenerationCharacterListProps {
  charSet: WorkSlot[]
  handleDimentionChange: (event: React.ChangeEvent<HTMLInputElement>, width: boolean, char: WorkSlot) => void
  defaultWidth: number
  defaultHeight: number
}

class GenerationCharacterList extends Component<GenerationCharacterListProps, {}> {
  constructor(props: GenerationCharacterListProps) {
    super(props)

    this.state = {
      
    }
  }

  render() {
    const charList = this.props.charSet.map(char => 
      <div key={char.character}>
        <p>{char.character}</p>
        <input 
          type='number' 
          value={char.width ?? this.props.defaultWidth} 
          onChange={(event) => this.props.handleDimentionChange(event, true, char)}
        />

        <input
          type='number' 
          value={char.height ?? this.props.defaultHeight} 
          onChange={(event) => this.props.handleDimentionChange(event, false, char)}
        />
      </div>
    )

    return (
      <div>
        {charList}
      </div>
    )
  }
}

export default GenerationCharacterList
