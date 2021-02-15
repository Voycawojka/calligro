import React, { Component, Fragment } from 'react'
import styles from './step2KerningPairsList.module.scss'
import { FontSpec, KerningPair } from '../../../generation/font/Font';
import { parseTemplateCode } from '../../../generation/template/parse'
import { bind } from 'helpful-decorators'
import { unicodeToChar, charToUnicode } from '../../../utils/char';
import Fa from '../../misc/fa/Fa';
import { CodePayload } from '../../../generation/template/types';

interface WorkKerningPair {
    first?: number,
    second?: number,
    amount?: number
}

interface Step2KerningPairsListProps {
    changeKernings: (kernings: KerningPair[]) => void
    handleKerningsValidity: (valid: boolean) => void
    templateCode?: CodePayload
}

interface Step2KerningPairsListState {
    pairs: WorkKerningPair[]
    UICodeCharList: number[]
}

class Step2KerningPairsList extends Component<Step2KerningPairsListProps, Step2KerningPairsListState> {
    private pairsContainerRef: React.RefObject<HTMLDivElement>

    constructor(props: Step2KerningPairsListProps) {
        super(props)
        this.state = {
            pairs: [],
            UICodeCharList: []
        }
        this.pairsContainerRef = React.createRef<HTMLDivElement>()
    }

    componentDidUpdate(prevProps: Step2KerningPairsListProps, prevState: Step2KerningPairsListState) {
        if (prevProps.templateCode !== this.props.templateCode) {
            this.setState({
                pairs: []
            })

            if (this.props.templateCode) {
                const parsedCode = this.props.templateCode?.slots.flatMap(char => char[0])

                if (parsedCode) {
                    this.setState({
                        UICodeCharList: parsedCode
                    })
                }
            }
        }

        if (prevState.pairs !== this.state.pairs) {
            if (this.isAllPairsValid) {
                this.props.changeKernings(this.state.pairs as KerningPair[])
            }

            this.props.handleKerningsValidity(this.isAllPairsValid)
        }
    }

    @bind
    addPair() {
        this.setState(prevState => ({
            pairs: [...prevState.pairs, {
                amount: 1
            }]
        }), () => this.scrollToBottom())
    }

    scrollToBottom() {
        if (this.pairsContainerRef.current) {
            this.pairsContainerRef.current.scrollTop = this.pairsContainerRef.current.scrollHeight
        }
    }

    @bind
    deletePair(index: number) {
        const newPairs = [...this.state.pairs]
        newPairs.splice(index, 1)

        this.setState({
            pairs: newPairs
        })
    }

    @bind
    changeChar(event: React.ChangeEvent<HTMLInputElement>, index: number, char: 'first' | 'second') {
         const value = event.target.value === '' ? undefined : charToUnicode(event.target.value.charAt(0))
         const newPairs = [...this.state.pairs]

         newPairs[index][char] = value

         this.setState({
            pairs: newPairs
         })
    }

    @bind
    changeAmount(event: React.ChangeEvent<HTMLInputElement>, index: number) {
        const value = event.target.value === '' ? undefined : parseInt(event.target.value, 10)
        const newPairs = [...this.state.pairs]

        newPairs[index].amount = value

        this.setState({
            pairs: newPairs
        })
    }

    @bind
    isCharLegal(char?: number): boolean {
        return char !== undefined ? this.state.UICodeCharList.includes(char) : false
    }

    
    isPairUnrepeated(pair: WorkKerningPair) {
        return this.state.pairs.filter(workPair => pair.first === workPair.first && pair.second === workPair.second).length < 2
    }

    isWorkPairLegal(pair: WorkKerningPair) {
        const {first, second, amount} = pair

        const isFirstCharLegal = this.isCharLegal(first)
        const isSecondCharLegal = this.isCharLegal(second)
        const isAmountLegal = !!amount

        return isFirstCharLegal && isSecondCharLegal && isAmountLegal
    }

    @bind
    isPairValid(pair: WorkKerningPair): boolean {
        return this.isWorkPairLegal(pair) && this.isPairUnrepeated(pair)
    }

    get isAllPairsValid(): boolean {
        return !this.state.pairs.some(pair => !this.isPairValid(pair))
    }

    get isAnyPairWithLegalCharsRepeated() {
        return this.state.pairs.some(pair => !this.isPairUnrepeated(pair) && this.isCharLegal(pair.first) && this.isCharLegal(pair.second))
    }

    render () {
        const renderPairs = this.state.pairs.map(( pair, index ) =>
            <Fragment key={index} >
                <input
                    aria-label='first letter input'
                    className={`${styles.input} ${this.isCharLegal(pair.first) && this.isPairUnrepeated(pair) ? '' : styles.inputInvalid}`}
                    value={pair.first ? unicodeToChar(pair.first) : ''}
                    onChange={(event) => this.changeChar(event, index, 'first')}
                    type='text'
                />

                <input
                    aria-label='second letter input'
                    className={`${styles.input} ${this.isCharLegal(pair.second) && this.isPairUnrepeated(pair) ? '' : styles.inputInvalid}`}
                    value={pair.second ? unicodeToChar(pair.second) : ''}
                    onChange={(event) => this.changeChar(event, index, 'second')}
                    type='text'
                />

                <input
                    aria-label='distance input'
                    className={`${styles.input} ${!!pair.amount ? '' : styles.inputInvalid}`}
                    value={pair.amount ?? ''}
                    onChange={(event) => this.changeAmount(event, index)}
                    type='number'
                />

                <button className={styles.button} onClick={() => this.deletePair(index)} title='Delete kerning pair'>
                    <Fa icon='fas fa-minus' />
                </button>
            </Fragment>
        )

        return (
            <div className={styles.container}>
                <label className={styles.label}>Kerning pairs
                    <Fa
                        icon='fas fa-question'
                        className={styles.questionMark}
                        title='Pairs of characters with non-default distance from each other. Only supported by some engines'
                    />
                </label>
                <div className={styles.pairsContainer} ref={this.pairsContainerRef}>
                    <label className={styles.pairsKey}>character 1</label>
                    <label className={styles.pairsKey}>character 2</label>
                    <label className={styles.pairsKey}>distance
                        <Fa
                            icon='fas fa-question'
                            className={styles.questionMark}
                            title=' This value is added to the default character distance when character 2 immediately follows character 1. Can be negative.'
                        />
                    </label>
                    <p className={styles.pairsKey}>
                        <button
                            className={styles.button}
                            onClick={this.addPair}
                            disabled={this.state.UICodeCharList.length === 0}
                            title='Add kerning pair'
                        >
                            <Fa icon='fas fa-plus' />
                        </button>
                    </p>
                    {renderPairs}
                </div>
                <p className={`${styles.warning} ${this.isAnyPairWithLegalCharsRepeated ? '' : styles.warningOff}`}>Some pairs are defined multiple times!</p>
            </div>
        )
    }
}

export default Step2KerningPairsList
