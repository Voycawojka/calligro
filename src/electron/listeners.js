const { ipcMain, dialog } = require('electron')
const { readVersion } = require('./version')

function setupIpcListeners(window) {
    ipcMain.on('save-template', saveTemplate)
    ipcMain.on('save-font', saveFont)
    ipcMain.on('request-version', () => requestVersion(window))
}

async function saveTemplate(_event, imageBlobBufferArray, templateCode) {
    const result = await dialog.showSaveDialog()

    if (result.canceled) {
        return
    }

    writeFile(`${result.filePath}.txt`, templateCode, (error) => {
        if (error) {
            dialog.showErrorBox('Error', error.message)
        }
    })
    writeFile(`${result.filePath}.png`, Buffer.from(imageBlobBufferArray), { encoding: 'base64' }, (error) => {
        if (error) {
            dialog.showErrorBox('Error', error.message)
        }
    })
}

async function saveFont(_event, fntFile, pagesBufferArray) {
    const result = await dialog.showSaveDialog()

    if (result.canceled) {
        return
    }

    writeFile(`${result.filePath}.fnt`, fntFile, (error) => {
        if (error) {
            dialog.showErrorBox('Error', error.message)
        }
    })

    for (let i = 0; i < pagesBufferArray.length; i++) {
        writeFile(`${result.filePath}-${i}.png`, Buffer.from(pagesBufferArray[i]), { encoding: 'base64' }, (error) => {
            if (error) {
                dialog.showErrorBox('Error', error.message)
            }
        })
    }
}

async function requestVersion(window) {
    const version = await readVersion()

    window.webContents.send('version', { version, platform: process.platform })
}

exports.setupIpcListeners = setupIpcListeners
