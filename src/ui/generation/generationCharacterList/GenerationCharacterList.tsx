import React from 'react'
import { WorkSlot } from '../../../generation/template/types'
import styles from './generationCharacterList.module.scss'

interface GenerationCharacterListProps {
    charSet: WorkSlot[]
    handleSpecificDimentionChange: (event: React.ChangeEvent<HTMLInputElement>, dimention: 'width' | 'height', char: WorkSlot) => void
    resetCharacterDimentions: (char: WorkSlot) => void
    defaultWidth: number
    defaultHeight: number
}

function GenerationCharacterList (props: GenerationCharacterListProps) {

    const charList = props.charSet.map(char =>
        <div key={char.character}>
            <span>{char.character}</span>
            <input
                className={styles.input}
                type='number'
                value={char.width ?? props.defaultWidth}
                onChange={(event) => props.handleSpecificDimentionChange(event, 'width', char)}
            />

            <input
                className={styles.input}
                type='number'
                value={char.height ?? props.defaultHeight}
                onChange={(event) => props.handleSpecificDimentionChange(event, 'height', char)}
            />
            <button onClick={() => props.resetCharacterDimentions(char)}>reset</button>
        </div>
    )

    return (
        <div className={styles.container}>
            {charList}
        </div>
    )
}

export default GenerationCharacterList
