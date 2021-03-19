const { writeFile } = require('fs')
const { ipcMain, dialog } = require('electron')
const { readVersion } = require('./version')
const { addRecentlySavedTemplate, addRecentlySavedFont } = require('./recentlySaved')
const { setupMenu } = require('./menu')
const { errorDialog } = require('./nativeDialogs')

function setupIpcListeners(app, window) {
    ipcMain.on('save-template', (_event, image, code) => saveTemplate(app, window, image, code))
    ipcMain.on('save-font', (_event, fnt, pages) => saveFont(app, window, fnt, pages))
    ipcMain.on('request-version', () => requestVersion(window))
}

async function saveTemplate(app, window, imageBlobBufferArray, templateCode) {
    const result = await dialog.showSaveDialog()

    if (result.canceled) {
        return
    }

    writeFile(`${result.filePath}.txt`, templateCode, (error) => {
        if (error) {
            errorDialog(`Cannot save ${result.filePath.txt}`, error.message)
        }
    })
    writeFile(`${result.filePath}.png`, Buffer.from(imageBlobBufferArray), { encoding: 'base64' }, (error) => {
        if (error) {
            errorDialog(`Cannot save ${result.filePath.png}`, error.message)
        }
    })

    await addRecentlySavedTemplate({
        name: result.filePath.split('/').pop().split('\\').pop(),
        path: `${result.filePath}.txt`
    }, app)

    setupMenu(app, window)
}

async function saveFont(app, window, fntFile, pagesBufferArray) {
    const result = await dialog.showSaveDialog()

    if (result.canceled) {
        return
    }

    writeFile(`${result.filePath}.fnt`, fntFile, (error) => {
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

exports.setupIpcListeners = setupIpcListeners
