const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const { writeFile } = require('fs')
const path = require('path')
const url = require('url')
const { constructMenuTemplate } = require('./menu')
const { readVersion } = require('./version')

function createWindow() {
    const window = new BrowserWindow({
        width: 1310,
        height: 850,
        webPreferences: {
            nodeIntegration: true
        },
        useContentSize: true
    })

    const appUrl = process.env.ELECTRON_URL || url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    })

    const menuTemplate = constructMenuTemplate(app, window)
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    window.loadURL(appUrl)

    if (process.env.ELECTRON_URL) {
        window.webContents.openDevTools()
    }

    readVersion().then(version => console.log(`Running version ${version}`))
}

app.whenReady().then(createWindow)

ipcMain.on('save-template', (event, imageBlobBufferArray, templateCode) => {
    dialog.showSaveDialog()
        .then(object => {
            if (!object.canceled) {
                writeFile(`${object.filePath}.txt`, templateCode, (error) => {
                    if (error) {
                        throw error
                    }
                })
                writeFile(`${object.filePath}.png`, Buffer.from(imageBlobBufferArray), { encoding: 'base64' }, (error) => {
                    if (error) {
                        throw error
                    }
                })
            }
        })
        .catch(error => dialog.showErrorBox('Error', error.message))
})

ipcMain.on('save-font', (event, fntFile, pagesBufferArray) => {
    dialog.showSaveDialog()
        .then(object => {
            if (!object.canceled) {
                writeFile(`${object.filePath}.fnt`, fntFile, (error) => {
                    if (error) {
                        throw error
                    }
                })

                for (let i = 0; i < pagesBufferArray.length; i++) {
                    writeFile(`${object.filePath}-${i}.png`, Buffer.from(pagesBufferArray[i]), { encoding: 'base64' }, (error) => {
                        if (error) {
                            throw error
                        }
                    })
                }
            }
        })
        .catch(error => dialog.showErrorBox('Error', error.message))
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
