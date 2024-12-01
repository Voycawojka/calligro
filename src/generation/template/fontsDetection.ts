import { isElectron } from "../../electron/electronInterop"
import { yieldIteration } from "../../utils/yield"

const ipcRenderer = window.require ? window.require('electron').ipcRenderer : null

const commonFonts = ["American Typewriter", "Andale Mono", "Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Avenir", "Avenir Next", "Avenir Next Condensed", "Bahnschrift", "Baskerville", "Big Caslon", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bradley Hand", "Brush Script MT", "Calibri", "Cambria", "Cambria Math", "Candara", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charter", "Cochin", "Comic Sans MS", "Consolas", "Constantia", "Copperplate", "Corbel", "Courier", "Courier New", "DIN Alternate", "DIN Condensed", "Didot", "Ebrima", "Franklin Gothic Medium", "Futura", "Gabriola", "Gadugi", "Geneva", "Georgia", "Gill Sans", "Helvetica", "Helvetica Neue", "Herculanum", "Hoefler Text", "HoloLens MDL2 Assets", "Impact", "Ink Free", "Javanese Text", "Leelawadee UI", "Lucida Console", "Lucida Grande", "Lucida Sans Unicode", "Luminari", "MS Gothic", "MV Boli", "Malgun Gothic", "Marker Felt", "Marlett", "Menlo", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU-ExtB", "Monaco", "Mongolian Baiti", "Myanmar Text", "Nirmala UI", "Noteworthy", "Optima", "Palatino", "Palatino Linotype", "Papyrus", "Phosphate", "Rockwell", "Savoye LET", "Segoe MDL2 Assets", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Emoji", "Segoe UI Historic", "Segoe UI Symbol", "SignPainter", "SimSun", "Sitka", "Skia", "Snell Roundhand", "Sylfaen", "Symbol", "Tahoma", "Times", "Times New Roman", "Trattatello", "Trebuchet MS", "Verdana", "Webdings", "Wingdings", "Yu Gothic", "Zapfino"]

interface IpcEvent {
}

async function checkForCommonFonts(): Promise<string[]> {
    await document.fonts.ready

    const installedFonts: string[] = []

    for (const font of commonFonts) {
        if (document.fonts.check(`12px "${font}"`)) {
            installedFonts.push(font)
        }

        await yieldIteration()
    }

    return installedFonts
}

function requestFontsFromElectron(): Promise<string[]> {
    return new Promise(resolve => {
        ipcRenderer?.once('fonts', (_event: IpcEvent, data: { fonts: string[] }) => resolve(data.fonts))
        ipcRenderer?.send('request-fonts')
    })
}

export function findSystemFonts(): Promise<string[]> {
    return isElectron()
        ? requestFontsFromElectron()
        : checkForCommonFonts()
}
