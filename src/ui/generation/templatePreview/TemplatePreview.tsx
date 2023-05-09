import React, { Component } from 'react'
import Template from '../../../generation/template/Template'
import styles from  './templatePreview.module.scss'

interface TemplatePreviewProps {
    width: number
    height: number
    template: Template
}

interface TemplatePreviewState {
}

class TemplatePreview extends Component<TemplatePreviewProps, TemplatePreviewState> {
    private canvas: React.RefObject<HTMLCanvasElement>
    private canvasContainer: React.RefObject<HTMLDivElement>

    private needsUpdate: boolean = false
    private live: boolean = false
    private lastTimeout: NodeJS.Timeout | number | null = null

    constructor(props: TemplatePreviewProps) {
        super(props)

        this.state = {}

        this.canvas = React.createRef()
        this.canvasContainer = React.createRef()
    }

    async draw() {
        if (this.needsUpdate) {
            if (this.canvas.current) {
                const ctx = this.canvas.current.getContext('2d')
                
                if (ctx) {
                    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height)
                    await this.props.template.copyOnto(ctx)
                }
            }
        }

        if (this.live) {
            this.lastTimeout = setTimeout(() => this.draw(), 500)
        }
    }

    componentDidMount() {
        this.needsUpdate = true
        this.live = true

        this.draw()
    }

    componentDidUpdate() {
        this.needsUpdate = true
    }

    componentWillUnmount() {
        this.needsUpdate = false
        this.live = false

        if (this.lastTimeout) {
            clearTimeout(this.lastTimeout as number)
            this.lastTimeout = null
        }
    }

    render() {
        return <div 
            className={styles.container}
            ref={this.canvasContainer}
            style={{ width: this.props.width, maxHeight: this.props.height }}>
            <canvas
                width={this.props.width}
                height={this.props.height}
                ref={this.canvas} />
        </div>
    }
}

export default TemplatePreview
