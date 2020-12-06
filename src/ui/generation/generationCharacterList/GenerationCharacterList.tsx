import React from 'react'
import { WorkSlot } from '../../../generation/template/types'
import styles from './generationCharacterList.module.scss'

interface GenerationCharacterListProps {
    charSet: WorkSlot[]
    handleDimensionChange: (event: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height', char: WorkSlot) => void
    resetCharacterDimensions: (char: WorkSlot) => void
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
                onChange={(event) => props.handleDimensionChange(event, 'width', char)}
            />

            <input
                className={styles.input}
                type='number'
                value={char.height ?? props.defaultHeight}
                onChange={(event) => props.handleDimensionChange(event, 'height', char)}
            />
            <button onClick={() => props.resetCharacterDimensions(char)}>reset</button>
        </div>
    )

    return (
        <div className={styles.container}>
            {charList}
        </div>
    )
}

export default GenerationCharacterList
