declare global {
    interface Window {
        isTauri?: boolean
    }
}

declare module '*.module.scss' {
    const classes: { [key: string]: string }
    export default classes
}

export {}
