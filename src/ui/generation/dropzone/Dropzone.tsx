import { Box } from '@mui/material'
import React, { Component } from 'react'

interface DropzoneProps {
    handleDropzoneInput: (data: File) => void
    fileName?: string
    acceptedInputType: string
    dataType?: string
    inputName: string
    error?: string
}

interface DropzoneState {
    dragCounter: number
}

class Dropzone extends Component<DropzoneProps, DropzoneState> {
    private templateInput: React.RefObject<HTMLInputElement>

    constructor(props: DropzoneProps) {
        super(props)

        this.state = {
            dragCounter: 0
        }

        this.templateInput = React.createRef()
    }

    isCorrectType(file: File) {
        if (!this.props.dataType) {
            return true;
        } else {
            return file.type === this.props.dataType
        }
    }

    handleFileInput(data?: File) {
        if (data && this.isCorrectType(data)) {
            this.props.handleDropzoneInput(data)
        }
    }

    handleInput() {
        const data = this.templateInput.current?.files?.[0]
       
        this.handleFileInput(data)
    }

    handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        const data = event.dataTransfer.files[0]

        this.handleFileInput(data)
        this.setState({
            dragCounter: 0
        })
    }

    dragOver (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
    }
    
    dragEnter (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()

        this.setState(prevState => ({
            dragCounter: prevState.dragCounter + 1
        }))
    }
    
    dragLeave (event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()

        this.setState(prevState => ({
            dragCounter: prevState.dragCounter - 1
        }))
    }

    render() {
        const renderUploadedFileName = this.props.fileName
            ? <p>Uploaded {this.props.fileName}</p>
            : null
        
        const renderError = this.props.error
            ? <p>{this.props.error}</p>
            : null

        return (
            <Box
                sx={{ p: 2, border: '1px dashed grey' }}
                onDrop={event => this.handleDrop(event)}
                onDragOver={event => this.dragOver(event)}
                onDragEnter={event => this.dragEnter(event)}
                onDragLeave={event => this.dragLeave(event)}
            >
                <label>Drag&amp;drop the {this.props.inputName}</label>
                <div>
                    <input
                        aria-label={`${this.props.inputName} input`}
                        type='file' ref={this.templateInput}
                        onChange={() => this.handleInput()}
                        accept={this.props.acceptedInputType}
                        title=" "
                    />
                </div>
                {renderUploadedFileName}
                {renderError}
            </Box>
        )
    }
}

export default Dropzone
