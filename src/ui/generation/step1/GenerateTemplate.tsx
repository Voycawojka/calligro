import React, { useState } from "react"
import Grid from '@mui/material/Unstable_Grid2'
import { Characters } from "./Characters"
import { CommonSettings } from "./CommonSettings"
import { PerCharacterSettings } from "./PerCharacterSettings"

interface GenerateTemplateProps {

}

export function GenerateTemplate(props: GenerateTemplateProps) {
    const defaultCharWidth = 100
    const defaultCharHeight = 100
    const defaultCharBase = 70

    const [characterString, setCharacterString] = useState('')
    const [charWidth, setCharWidth] = useState(defaultCharWidth)
    const [charHeight, setCharHeight] = useState(defaultCharHeight)
    const [charBase, setCharBase] = useState(defaultCharBase)
    const [prefill, setPrefill] = useState<string | null>(null)

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <Characters
                    defaultPreset="Basic Latin"
                    onCharacterStringChanged={value => setCharacterString(value)}
                />
            </Grid>
            <Grid xs={12} md={6}>
                <CommonSettings
                    defaultWidth={defaultCharWidth}
                    defaultHeight={defaultCharHeight}
                    defaultBase={defaultCharBase}
                    onWidthChanged={value => setCharWidth(value)}
                    onHeightChanged={value => setCharHeight(value)}
                    onBaseChanged={value => setCharBase(value)}
                    onPrefillChanged={value => setPrefill(value)}
                />
            </Grid>
            <Grid xs={12} md={6}>
                <PerCharacterSettings
                    characterString={characterString}
                    commonWidth={charWidth}
                    commonHeight={charHeight}
                />
            </Grid>
        </Grid>

        // <div className={styles.parameters}>
        //     <div className={styles.commonParameters}>
        //         <div>
        //             <label className={styles.label}>Common</label>
        //             <label className={styles.commonLabel}>Size</label>
        //             <input
        //                 aria-label='default width input'
        //                 className={styles.commonInput}
        //                 type='number'
        //                 onChange={event => this.handleDefaultValueChange(event, 'defaultWidth')}
        //                 value={this.state.defaultWidth}
        //             />
        //             <Fa icon='fas fa-times' className={styles.times} />
        //             <input
        //                 aria-label='default height input'
        //                 className={styles.commonInput}
        //                 type='number'
        //                 onChange={event => this.handleDefaultValueChange(event, 'defaultHeight')}
        //                 value={this.state.defaultHeight}
        //             />
        //             <Fa icon='fas fa-question' className={styles.questionMark} title='Default size of one character in pixels' />
        //         </div>

        //         <div>
        //             <label className={styles.commonLabel}>Base</label>
        //             <input
        //                 aria-label='characters base input'
        //                 className={`${styles.commonInput} ${this.isBaseValid() ? '' : styles.commonInputIvalid}`}
        //                 type='number'
        //                 onChange={event => this.handleDefaultValueChange(event, 'base')}
        //                 value={this.state.base}
        //             />
        //             <Fa
        //                 icon='fas fa-question'
        //                 className={styles.questionMark}
        //                 title='Distance from the top of the letter to the line base in pixels (character parts below this will stick out like in "g" or "j")'
        //             />
        //         </div>

        //         <div>
        //             <label className={styles.commonLabel}>Prefill</label>
        //             <input
        //                 list="prefill-datalist"
        //                 aria-label='unicode presets selection input'
        //                 onChange={event => this.changePrefill(event)}
        //                 value={this.state.fontOptions?.name}
        //                 className={styles.prefillSelect}
        //             />

        //             <datalist id="prefill-datalist">
        //                 {defaultPrefillOption}
        //                 {prefillOptions}
        //             </datalist>
        //             <Fa
        //                 icon='fas fa-question'
        //                 className={styles.questionMark}
        //                 title='Vector font to prefill the template with. Leave empty to not prefill.'
        //             />
        //         </div>

        //         <button
        //             onClick={() => this.downloadTemplate()}
        //             className={styles.formButton}
        //             disabled={!this.isSlotArrayValid() || !this.isBaseValid()}
        //         >
        //             {`${isElectron() ? 'save' : 'download'} template`}
        //         </button>
        //     </div>

        //     <div className={styles.perCharacterParameters} >
        //         <label className={styles.label}>
        //             Per character
        //             <Fa
        //                 icon='fas fa-question'
        //                 className={styles.questionMark}
        //                 title='Override default size per character'
        //             />
        //         </label>

        //         <Step1CharacterList
        //             charSet={this.state.charSet}
        //             defaultHeight={this.state.defaultHeight}
        //             defaultWidth={this.state.defaultWidth}
        //             handleDimensionChange={(event, dimension, char) => this.handleDimensionChange(event, dimension, char)}
        //             resetCharacterDimensions={char => this.resetCharacterDimensions(char)}
        //         />
        //     </div>
        // </div>
    )
}