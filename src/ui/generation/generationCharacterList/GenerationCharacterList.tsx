import React from 'react'
import { WorkSlot } from '../../../generation/template/types'
import Fa from '../fa/Fa'
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
        <div key={char.character} className={styles.characterContainer}>
            <p className={styles.character}>{char.character}</p>
            <input
                className={styles.input}
                type='number'
                value={char.width ?? props.defaultWidth}
                onChange={(event) => props.handleDimensionChange(event, 'width', char)}
            />
            <Fa icon='fas fa-times' className={styles.times} />
            <input
                className={styles.input}
                type='number'
                value={char.height ?? props.defaultHeight}
                onChange={(event) => props.handleDimensionChange(event, 'height', char)}
            />

            {   
                !!char.height || !!char.width
                ? <span className={styles.buttonContainer}>
                    <button onClick={() => props.resetCharacterDimensions(char)} className={styles.button}>
                        <Fa icon='fas fa-times' className={styles.timesButton} />
                    </button>
                </span >
                : null
            }
        </div>
    )

    return (
        <div className={styles.container}>
            {charList}
        </div>
    )
}

export default GenerationCharacterList
