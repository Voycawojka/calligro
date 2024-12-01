const { writeFile } = require('fs')
const { ipcMain, dialog } = require('electron')
const { getFonts } = require('font-list')
const { readVersion } = require('./version')
const { addRecentlySavedTemplate, addRecentlySavedFont } = require('./recentlySaved')
const { setupMenu } = require('./menu')
const { errorDialog } = require('./nativeDialogs')
const path = require('path')

function setupIpcListeners(app, window) {
    ipcMain.on('save-template', (_event, image, code, readme) => saveTemplate(app, window, image, code, readme))
    ipcMain.on('save-font', (_event, fnt, pages) => saveFont(app, window, fnt, pages))
    ipcMain.on('request-version', () => requestVersion(window))
    ipcMain.on('request-fonts', () => requestFonts(window))
}

async function saveTemplate(app, window, imageBlobBufferArray, templateCode, readme) {
    const result = await dialog.showSaveDialog()

    if (result.canceled) {
        return
    }

    writeFile(`${result.filePath}.calligro`, templateCode, (error) => {
        if (error) {
            errorDialog(`Cannot save ${result.filePath}.calligro`, error.message)
        }
    })
    writeFile(`${result.filePath}.png`, Buffer.from(imageBlobBufferArray), { encoding: 'base64' }, (error) => {
        if (error) {
            errorDialog(`Cannot save ${result.filePath}.png`, error.message)
        }
    })
    writeFile(`${result.filePath}-readme.txt`, readme, (error) => {
        if (error) {
            errorDialog(`Cannon save ${result.filePath}-readme.txt`, readme, error.message)
        }
    })

    await addRecentlySavedTemplate({
        name: result.filePath.split('/').pop().split('\\').pop(),
        path: `${result.filePath}.calligro`
    }, app)

    setupMenu(app, window)
}

async function saveFont(app, window, fntFile, pagesBufferArray) {
    const result = await dialog.showSaveDialog()

    if (result.canceled) {
        return
    }

    let adjustedFntFile = fntFile
    for (let i = 0; i < pagesBufferArray.length; i++) {
        adjustedFntFile = adjustedFntFile.replace(`@<<PAGE_FILE_NAME_${i}>>`, path.basename(`${result.filePath}-${i}.png`))
    }

    writeFile(`${result.filePath}.fnt`, adjustedFntFile, (error) => {
        if (error) {
            errorDialog(`Cannot save ${result.filePath}.fnt`, error.message)
        }
    })

    for (let i = 0; i < pagesBufferArray.length; i++) {
        writeFile(`${result.filePath}-${i}.png`, Buffer.from(pagesBufferArray[i]), { encoding: 'base64' }, (error) => {
            if (error) {
                errorDialog(`Cannot save ${result.filePath}.png`, error.message)
            }
        })
    }
}

async function requestVersion(window) {
    const version = await readVersion()

    window.webContents.send('version', { version, platform: process.platform })
}

async function requestFonts(window) {
    const fonts = await getFonts({ disableQuoting: true })

    window.webContents.send('fonts', { fonts })
}

exports.setupIpcListeners = setupIpcListeners
