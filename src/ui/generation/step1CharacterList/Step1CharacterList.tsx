import React from 'react'
import { WorkSlot } from '../../../generation/template/types'
import Fa from '../../misc/fa/Fa'
import styles from './step1CharacterList.module.scss'
import { NumInputValue, standardizeNumericalInput } from '../../../utils/input'

interface Step1CharacterListProps {
    charSet: WorkSlot[]
    handleDimensionChange: (event: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height', char: WorkSlot) => void
    resetCharacterDimensions: (char: WorkSlot) => void
    defaultWidth: NumInputValue
    defaultHeight: NumInputValue
}

function Step1CharacterList (props: Step1CharacterListProps) {
    const charList = props.charSet.map(char => {
        const width = char.width ?? props.defaultWidth
        const height = char.height ?? props.defaultHeight

        return (
            <div key={char.character} className={styles.characterContainer}>
                <p className={styles.character}>{char.character}</p>
                <input
                    aria-label={`${char.character} width input`}
                    className={`${styles.input} ${standardizeNumericalInput(width) <= 0 ? styles.inputInvalid : ''}`}
                    type='number'
                    value={width}
                    onChange={(event) => props.handleDimensionChange(event, 'width', char)}
                />
                <Fa icon='fas fa-times' className={styles.times} />
                <input
                    aria-label={`${char.character} height input`}
                    className={`${styles.input} ${standardizeNumericalInput(height) <= 0 ? styles.inputInvalid : ''}`}
                    type='number'
                    value={height}
                    onChange={(event) => props.handleDimensionChange(event, 'height', char)}
                />

                {
                    (!!char.height || !!char.width) || (standardizeNumericalInput(width) <= 0 || standardizeNumericalInput(height) <= 0)
                    ? <span className={styles.buttonContainer}>
                        <button onClick={() => props.resetCharacterDimensions(char)} className={styles.button}>
                            <Fa icon='fas fa-undo' className={styles.undoButton} />
                        </button>
                    </span >
                    : null
                }
            </div>
        )
    })

    return (
        <div className={styles.container}>
            {charList}
        </div>
    )
}

export default Step1CharacterList
