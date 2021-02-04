import { bind } from 'helpful-decorators'
import React, { Component } from 'react'
import styles from './dropzone.module.scss'

interface DropzoneProps {
    handleDropzoneInput: (data: File) => void
    fileName?: string
    acceptedInputType: string
    dataType: string
    inputName: string
    error?: string
}

class Dropzone extends Component<DropzoneProps, {}> {
    private templateInput: React.RefObject<HTMLInputElement>

    constructor(props: DropzoneProps) {
        super(props)

        this.templateInput = React.createRef()
    }

    handleFileInput(data?: File) {
        if (data && data.type === this.props.dataType) {
            this.props.handleDropzoneInput(data)
        }
    }

    @bind
    handleInput() {
        const data = this.templateInput.current?.files?.[0]
       
        this.handleFileInput(data)
    }

    @bind
    handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        const data = event.dataTransfer.files[0]

        this.handleFileInput(data)
    }

    dragOver (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
    }
    
    @bind
    dragEnter (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
    }
    
    @bind
    dragLeave (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
    }

    render() {
        const renderUploadedFileName = this.props.fileName
            ? <p className={styles.fileName}>Uploaded {this.props.fileName}</p>
            : null
        
        const renderError = this.props.error
            ? <p className={styles.error}>{this.props.error}</p>
            : null

        return (
            <div
                className={styles.container}
                onDrop={this.handleDrop}
                onDragOver={this.dragOver}
                onDragEnter={this.dragEnter}
                onDragLeave={this.dragLeave}
            >
                <label className={styles.label}>Drag&amp;drop the {this.props.inputName}</label>
                <div className={styles.inputContainer}>
                    <input
                        aria-label={`${this.props.inputName} input`}
                        className={styles.input}
                        type='file' ref={this.templateInput}
                        onChange={this.handleInput}
                        accept={this.props.acceptedInputType}
                        title=" "
                    />
                </div>
                {renderUploadedFileName}
                {renderError}
            </div>
        )
    }
}

export default Dropzone
