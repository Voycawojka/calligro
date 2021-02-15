import React, { Component } from 'react'
import { FontConfig, generateFont } from '../../../generation/font/Font'
import { CodePayload } from '../../../generation/template/types'
import { drawPreview } from '../../../preview/preview'
import styles from  './preview.module.scss'

interface PreviewProps {
    width: number
    height: number
    templateCode?: CodePayload
    templateImg?: Blob
    fontConfig: FontConfig
}

interface PreviewState {
    text: string
    scale: number
}

class Preview extends Component<PreviewProps, PreviewState> {
    private canvas: React.RefObject<HTMLCanvasElement>

    constructor(props: PreviewProps) {
        super(props)

        this.state = {
            text: '',
            scale: 1
        }

        this.canvas = React.createRef()
    }

    async draw() {
        if (this.canvas.current && this.props.templateImg && this.props.templateCode) {
            const ctx = this.canvas.current.getContext('2d');
            const spec = await generateFont(this.props.templateImg, this.props.templateCode, this.props.fontConfig)
            ctx && drawPreview(this.state.text, spec[0], spec[1], this.state.scale, ctx);
        }
    }

    componentDidMount() {
        this.draw()
    }

    componentDidUpdate() {
        this.draw()
    }

    render() {
        return <div>
            <textarea
                aria-label='preview text input'
                onChange={event => this.setState({ text: event.target.value })}
                value={this.state.text}
                className={styles.previewInput}
                placeholder='Type something to preview the font' />
            <input
                aria-label='preview scale input'
                type='number'
                step={0.01}
                min={0.01}
                onChange={event => this.setState({ scale: parseFloat(event.target.value) })}
                value={this.state.scale} />
            <canvas 
                width={this.props.width} 
                height={this.props.height} 
                ref={this.canvas} 
                className={styles.canvas} />
        </div>
    }
}

export default Preview
